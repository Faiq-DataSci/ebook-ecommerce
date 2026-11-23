import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pdfrx/pdfrx.dart';

import '../../../../core/network/dio_client.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Properti yang dibutuhkan untuk menampilkan dokumen PDF privat.
class PdfDocumentViewProps {
  final String signedUrl;
  final int initialPage;
  final String? watermarkText;
  final PdfViewerController controller;
  final ValueChanged<int> onPageChanged;
  final ValueChanged<int> onDocumentReady;
  final VoidCallback onRetry;

  const PdfDocumentViewProps({
    required this.signedUrl,
    required this.initialPage,
    required this.controller,
    required this.onPageChanged,
    required this.onDocumentReady,
    required this.onRetry,
    this.watermarkText,
  });
}

typedef PdfDocumentViewBuilder =
    Widget Function(BuildContext context, PdfDocumentViewProps props);

/// Provider agar renderer PDF dapat diganti pada pengujian widget tanpa
/// memuat mesin PDF native.
final pdfDocumentViewBuilderProvider = Provider<PdfDocumentViewBuilder>(
  (ref) =>
      (context, props) => PdfDocumentView(props: props),
);

/// Menampilkan berkas PDF asli dari signed URL privat.
///
/// Alur: unduh byte PDF melalui Dio terpusat (tanpa menyertakan token aplikasi
/// ke host storage), lalu render menggunakan `pdfrx`. Berkas hanya berada di
/// memori selama sesi baca dan tidak diekspor ke penyimpanan perangkat.
class PdfDocumentView extends ConsumerStatefulWidget {
  final PdfDocumentViewProps props;

  const PdfDocumentView({super.key, required this.props});

  @override
  ConsumerState<PdfDocumentView> createState() => _PdfDocumentViewState();
}

class _PdfDocumentViewState extends ConsumerState<PdfDocumentView> {
  Uint8List? _bytes;
  bool _isLoading = true;
  double _progress = 0.0;
  String? _error;
  bool _isRetryableWithNewUrl = false;
  int _loadId = 0;

  @override
  void initState() {
    super.initState();
    _startDownload();
  }

  @override
  void didUpdateWidget(covariant PdfDocumentView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.props.signedUrl != widget.props.signedUrl) {
      _startDownload();
    }
  }

  String _friendlyError(Object error) {
    if (error is DioException) {
      final status = error.response?.statusCode;
      if (status == 400 || status == 401 || status == 403 || status == 404) {
        _isRetryableWithNewUrl = true;
        return 'Tautan baca telah kedaluwarsa atau tidak valid.';
      }
    }
    return 'Gagal mengunduh berkas e-book. Periksa koneksi Anda.';
  }

  Future<void> _startDownload() async {
    final id = ++_loadId;
    setState(() {
      _isLoading = true;
      _progress = 0.0;
      _error = null;
      _isRetryableWithNewUrl = false;
      _bytes = null;
    });

    try {
      final dio = ref.read(dioClientProvider);
      final response = await dio.get<List<int>>(
        widget.props.signedUrl,
        options: Options(
          responseType: ResponseType.bytes,
          extra: const <String, dynamic>{'skipAuth': true},
          headers: const <String, dynamic>{'Accept': 'application/pdf'},
        ),
        onReceiveProgress: (received, total) {
          if (!mounted || id != _loadId) return;
          if (total > 0) {
            setState(() => _progress = (received / total).clamp(0.0, 1.0));
          }
        },
      );

      final raw = response.data;
      final bytes = raw == null ? Uint8List(0) : Uint8List.fromList(raw);
      if (bytes.isEmpty) {
        throw const FormatException('Berkas PDF kosong.');
      }
      if (!mounted || id != _loadId) return;

      setState(() {
        _bytes = bytes;
        _isLoading = false;
        _progress = 1.0;
      });
    } catch (error) {
      if (!mounted || id != _loadId) return;
      setState(() {
        _isLoading = false;
        _error = _friendlyError(error);
      });
    }
  }

  void _retry() {
    if (_isRetryableWithNewUrl) {
      widget.props.onRetry();
    } else {
      _startDownload();
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return _buildLoading();
    }
    if (_error != null || _bytes == null) {
      return _buildError();
    }
    return _buildDocument(_bytes!);
  }

  Widget _buildLoading() {
    final percent = (_progress * 100).round();
    return Container(
      color: AppColors.nbPaper,
      alignment: Alignment.center,
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const CircularProgressIndicator(
            strokeWidth: 3.0,
            color: AppColors.nbBlack,
          ),
          const SizedBox(height: 14.0),
          Text(
            'MENGUNDUH NASKAH PDF... $percent%',
            style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 12),
          ),
          const SizedBox(height: 10.0),
          Container(
            width: 220.0,
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.nbBlack, width: 1.5),
            ),
            child: LinearProgressIndicator(
              value: _progress,
              minHeight: 8.0,
              backgroundColor: AppColors.nbMuted,
              color: AppColors.nbYellow,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildError() {
    return Center(
      child: Container(
        margin: const EdgeInsets.all(24.0),
        padding: const EdgeInsets.all(16.0),
        decoration: AppTheme.brutalBox(
          color: AppColors.nbWhite,
          borderColor: AppColors.nbBlack,
          borderWidth: 2.5,
          shadowOffset: 4,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.picture_as_pdf_outlined,
              size: 36.0,
              color: AppColors.nbPink,
            ),
            const SizedBox(height: 10.0),
            const Text(
              'Gagal Membuka Naskah PDF',
              style: TextStyle(
                fontFamily: AppTheme.fontHeadline,
                fontSize: 14.0,
                fontWeight: FontWeight.w800,
                color: AppColors.nbBlack,
              ),
            ),
            const SizedBox(height: 6.0),
            Text(
              _error ?? 'Berkas PDF tidak tersedia.',
              textAlign: TextAlign.center,
              style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 12),
            ),
            const SizedBox(height: 16.0),
            InkWell(
              key: const Key('pdf_retry_button'),
              onTap: _retry,
              child: Container(
                height: 40.0,
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                alignment: Alignment.center,
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbYellow,
                  borderColor: AppColors.nbBlack,
                  borderWidth: 2.0,
                  shadowOffset: 2,
                ),
                child: Text(
                  _isRetryableWithNewUrl
                      ? 'MUAT ULANG TAUTAN BACA'
                      : 'COBA LAGI',
                  style: const TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 12.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.nbBlack,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDocument(Uint8List bytes) {
    return Stack(
      children: [
        Positioned.fill(
          child: PdfViewer.data(
            bytes,
            key: const Key('pdf_document_view'),
            sourceName: widget.props.signedUrl,
            controller: widget.props.controller,
            initialPageNumber: widget.props.initialPage,
            params: PdfViewerParams(
              backgroundColor: AppColors.nbPaper,
              onViewerReady: (document, controller) {
                final pageCount = document.pages.length;
                Future<void>.microtask(() {
                  if (!mounted) return;
                  widget.props.onDocumentReady(pageCount);
                });
              },
              onPageChanged: (pageNumber) {
                if (pageNumber == null || !mounted) return;
                widget.props.onPageChanged(pageNumber);
              },
            ),
          ),
        ),
        if (widget.props.watermarkText != null)
          Positioned.fill(
            child: IgnorePointer(
              child: Center(
                child: Transform.rotate(
                  angle: -0.4,
                  child: Text(
                    widget.props.watermarkText!,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontFamily: AppTheme.fontMono,
                      fontSize: 12.0,
                      fontWeight: FontWeight.w900,
                      color: AppColors.nbBlack.withValues(alpha: 0.06),
                      letterSpacing: 2.0,
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
