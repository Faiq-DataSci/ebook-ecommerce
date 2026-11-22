import 'package:flutter/material.dart';
import '../../../../core/utils/rupiah_formatter.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/catalog_category.dart';
import '../../domain/entities/catalog_filter.dart';

/// Bottom Sheet Filter Katalog E-Book (Google Stitch + design.md §8.4 & Prompt §7).
class PriceFilterSheet extends StatefulWidget {
  final CatalogFilter initialFilter;
  final List<CatalogCategory> categories;
  final int minAvailablePrice;
  final int maxAvailablePrice;
  final int previewBookCount;
  final ValueChanged<CatalogFilter> onApply;
  final VoidCallback onReset;

  const PriceFilterSheet({
    super.key,
    required this.initialFilter,
    required this.categories,
    this.minAvailablePrice = 10000,
    this.maxAvailablePrice = 150000,
    this.previewBookCount = 0,
    required this.onApply,
    required this.onReset,
  });

  @override
  State<PriceFilterSheet> createState() => _PriceFilterSheetState();
}

class _PriceFilterSheetState extends State<PriceFilterSheet> {
  late String? _selectedCategoryId;
  late String? _selectedCategoryName;
  late final TextEditingController _authorController;
  late double _currentMinPrice;
  late double _currentMaxPrice;
  late double? _selectedRating;

  @override
  void initState() {
    super.initState();
    _selectedCategoryId = widget.initialFilter.categoryId;
    _selectedCategoryName = widget.initialFilter.categoryName;
    _authorController = TextEditingController(
      text: widget.initialFilter.author ?? '',
    );

    final minLimit = widget.minAvailablePrice.toDouble();
    final maxLimit = widget.maxAvailablePrice > widget.minAvailablePrice
        ? widget.maxAvailablePrice.toDouble()
        : minLimit + 100000;

    _currentMinPrice = (widget.initialFilter.minPrice?.toDouble() ?? minLimit)
        .clamp(minLimit, maxLimit);
    _currentMaxPrice = (widget.initialFilter.maxPrice?.toDouble() ?? maxLimit)
        .clamp(minLimit, maxLimit);

    if (_currentMinPrice > _currentMaxPrice) {
      _currentMinPrice = minLimit;
      _currentMaxPrice = maxLimit;
    }

    _selectedRating = widget.initialFilter.minRating;
  }

  @override
  void dispose() {
    _authorController.dispose();
    super.dispose();
  }

  void _resetLocal() {
    setState(() {
      _selectedCategoryId = null;
      _selectedCategoryName = null;
      _authorController.clear();
      _currentMinPrice = widget.minAvailablePrice.toDouble();
      final maxLimit = widget.maxAvailablePrice > widget.minAvailablePrice
          ? widget.maxAvailablePrice.toDouble()
          : _currentMinPrice + 100000;
      _currentMaxPrice = maxLimit;
      _selectedRating = null;
    });
  }

  void _applyFilter() {
    final minLimit = widget.minAvailablePrice.toDouble();
    final maxLimit = widget.maxAvailablePrice > widget.minAvailablePrice
        ? widget.maxAvailablePrice.toDouble()
        : minLimit + 100000;

    final isMinCustom = _currentMinPrice > minLimit;
    final isMaxCustom = _currentMaxPrice < maxLimit;

    final updated = widget.initialFilter.copyWith(
      categoryId: _selectedCategoryId,
      clearCategoryId: _selectedCategoryId == null,
      categoryName: _selectedCategoryName,
      clearCategoryName: _selectedCategoryId == null,
      author: _authorController.text.trim().isNotEmpty
          ? _authorController.text.trim()
          : null,
      clearAuthor: _authorController.text.trim().isEmpty,
      minPrice: isMinCustom ? _currentMinPrice.round() : null,
      clearMinPrice: !isMinCustom,
      maxPrice: isMaxCustom ? _currentMaxPrice.round() : null,
      clearMaxPrice: !isMaxCustom,
      minRating: _selectedRating,
      clearMinRating: _selectedRating == null,
    );

    widget.onApply(updated);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final minLimit = widget.minAvailablePrice.toDouble();
    final maxLimit = widget.maxAvailablePrice > widget.minAvailablePrice
        ? widget.maxAvailablePrice.toDouble()
        : minLimit + 100000;

    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
      decoration: BoxDecoration(
        color: AppColors.nbPaper,
        border: Border(
          top: BorderSide(
            color: AppColors.nbBlack,
            width: AppTheme.borderThick,
          ),
        ),
      ),
      child: SafeArea(
        top: false,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              // Handle Bar
              Center(
                child: Container(
                  width: 40,
                  height: 6,
                  decoration: BoxDecoration(
                    color: AppColors.nbBlack,
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              // Header Sheet
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      const Icon(
                        Icons.tune,
                        size: 22,
                        color: AppColors.nbBlack,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'FILTER KATALOG',
                        style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                      ),
                    ],
                  ),
                  InkWell(
                    key: const Key('filter_sheet_close_button'),
                    onTap: () => Navigator.of(context).pop(),
                    child: Container(
                      width: 32,
                      height: 32,
                      alignment: Alignment.center,
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbWhite,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 2,
                      ),
                      child: const Icon(
                        Icons.close,
                        size: 18,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),
                ],
              ),
              const Divider(color: AppColors.nbBlack, thickness: 2, height: 24),

              // 1. Kategori
              Text(
                'KATEGORI E-BOOK',
                style: AppTheme.labelSm(
                  AppColors.nbBlack,
                  fontSize: 12,
                ).copyWith(letterSpacing: 0.5),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: <Widget>[
                  _buildCategoryChoice(
                    id: null,
                    label: 'Semua',
                    isSelected: _selectedCategoryId == null,
                  ),
                  for (final cat in widget.categories)
                    _buildCategoryChoice(
                      id: cat.id,
                      label: cat.name,
                      isSelected: _selectedCategoryId == cat.id,
                    ),
                ],
              ),
              const SizedBox(height: 20),

              // 2. Filter Penulis (design.md §8.4)
              Text(
                'PENULIS E-BOOK',
                style: AppTheme.labelSm(
                  AppColors.nbBlack,
                  fontSize: 12,
                ).copyWith(letterSpacing: 0.5),
              ),
              const SizedBox(height: 8),
              Container(
                height: 42,
                padding: const EdgeInsets.symmetric(horizontal: 10),
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbWhite,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderDefault,
                  shadowOffset: 2,
                ),
                child: TextField(
                  key: const Key('filter_author_input'),
                  controller: _authorController,
                  style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 13),
                  decoration: const InputDecoration(
                    isDense: true,
                    contentPadding: EdgeInsets.symmetric(vertical: 10),
                    border: InputBorder.none,
                    hintText: 'Nama penulis...',
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // 3. Rentang Harga (RangeSlider fungsional, validasi min <= max)
              Wrap(
                alignment: WrapAlignment.spaceBetween,
                crossAxisAlignment: WrapCrossAlignment.center,
                spacing: 8,
                runSpacing: 6,
                children: <Widget>[
                  Text(
                    'RENTANG HARGA',
                    style: AppTheme.labelSm(
                      AppColors.nbBlack,
                      fontSize: 12,
                    ).copyWith(letterSpacing: 0.5),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: AppTheme.brutalBox(
                      color: AppColors.nbYellow,
                      borderColor: AppColors.nbBlack,
                      borderWidth: AppTheme.borderThin,
                      shadowOffset: 1,
                    ),
                    child: Text(
                      '${formatRupiah(_currentMinPrice)} - ${formatRupiah(_currentMaxPrice)}',
                      style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 10),
                    ),
                  ),
                ],
              ),
              RangeSlider(
                key: const Key('filter_price_slider'),
                min: minLimit,
                max: maxLimit,
                divisions: 20,
                values: RangeValues(_currentMinPrice, _currentMaxPrice),
                activeColor: AppColors.nbBlack,
                inactiveColor: AppColors.surfaceContainer,
                onChanged: (values) {
                  setState(() {
                    _currentMinPrice = values.start;
                    _currentMaxPrice = values.end;
                  });
                },
              ),
              const SizedBox(height: 16),

              // 4. Rating Minimum (design.md §8.4)
              Text(
                'RATING MINIMUM',
                style: AppTheme.labelSm(
                  AppColors.nbBlack,
                  fontSize: 12,
                ).copyWith(letterSpacing: 0.5),
              ),
              const SizedBox(height: 8),
              Row(
                children: <Widget>[
                  _buildRatingButton(label: 'Semua', value: null),
                  const SizedBox(width: 6),
                  _buildRatingButton(label: '★ 3.0+', value: 3.0),
                  const SizedBox(width: 6),
                  _buildRatingButton(label: '★ 4.0+', value: 4.0),
                  const SizedBox(width: 6),
                  _buildRatingButton(label: '★ 4.5+', value: 4.5),
                ],
              ),
              const SizedBox(height: 24),

              // Action Footer (Reset vs Terapkan)
              Row(
                children: <Widget>[
                  Expanded(
                    flex: 1,
                    child: InkWell(
                      key: const Key('filter_sheet_reset_button'),
                      onTap: () {
                        _resetLocal();
                        widget.onReset();
                        Navigator.of(context).pop();
                      },
                      child: Container(
                        height: 46,
                        alignment: Alignment.center,
                        decoration: AppTheme.brutalBox(
                          color: AppColors.nbWhite,
                          borderColor: AppColors.nbBlack,
                          borderWidth: AppTheme.borderDefault,
                          shadowOffset: 3,
                        ),
                        child: Text(
                          'RESET',
                          style: AppTheme.labelSm(
                            AppColors.nbBlack,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: InkWell(
                      key: const Key('filter_sheet_apply_button'),
                      onTap: _applyFilter,
                      child: Container(
                        height: 46,
                        alignment: Alignment.center,
                        decoration: AppTheme.brutalBox(
                          color: AppColors.nbYellow,
                          borderColor: AppColors.nbBlack,
                          borderWidth: AppTheme.borderDefault,
                          shadowOffset: 3,
                        ),
                        child: Text(
                          'TERAPKAN FILTER',
                          style: AppTheme.labelSm(
                            AppColors.nbBlack,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryChoice({
    required String? id,
    required String label,
    required bool isSelected,
  }) {
    return InkWell(
      key: Key('filter_choice_${id ?? 'all'}'),
      onTap: () {
        setState(() {
          _selectedCategoryId = id;
          _selectedCategoryName = id == null ? null : label;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: AppTheme.brutalBox(
          color: isSelected ? AppColors.nbYellow : AppColors.nbWhite,
          borderColor: AppColors.nbBlack,
          borderWidth: AppTheme.borderDefault,
          shadowOffset: isSelected ? 2 : 1,
        ),
        child: Text(
          label,
          style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 11),
        ),
      ),
    );
  }

  Widget _buildRatingButton({required String label, required double? value}) {
    final isSelected = _selectedRating == value;
    return Expanded(
      child: InkWell(
        key: Key('filter_rating_${value ?? 'all'}'),
        onTap: () {
          setState(() {
            _selectedRating = value;
          });
        },
        child: Container(
          height: 36,
          alignment: Alignment.center,
          decoration: AppTheme.brutalBox(
            color: isSelected ? AppColors.nbYellow : AppColors.nbWhite,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: isSelected ? 2 : 1,
          ),
          child: Text(
            label,
            style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 10),
          ),
        ),
      ),
    );
  }
}
