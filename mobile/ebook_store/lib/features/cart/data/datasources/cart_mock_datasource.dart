import '../../../../core/constants/app_assets.dart';
import '../../domain/entities/cart_failure.dart';
import '../../domain/entities/cart_item.dart';
import '../../domain/entities/cart_promo.dart';
import '../models/cart_item_model.dart';

abstract class CartMockDataSource {
  Future<List<CartItem>> getCartItems();
  Future<List<CartItem>> getRecommendedSawItems();
  Future<CartPromo> validatePromoCode(String code);
}

// Simulation fixture matching Stitch layer Keranjang Belanja Mobile (Zona C).
class CartMockDataSourceImpl implements CartMockDataSource {
  static const String simulationBadge = 'DATA SIMULASI';
  static const String transactionMatrixCode = 'SAW-C2-PAY';
  static const int defaultCloudSyncFee = 1000;

  static const CartPromo defaultPromo = CartPromo(
    code: 'BUKUBARU',
    badgeLabel: 'HEMAT 10K',
    discountAmount: 10000,
  );

  static const List<CartPromo> _availablePromos = <CartPromo>[
    defaultPromo,
    CartPromo(
      code: 'SAWHEMAT',
      badgeLabel: 'HEMAT 15K',
      discountAmount: 15000,
    ),
  ];

  static const List<CartItemModel> initialCartItems = <CartItemModel>[
    CartItemModel(
      id: 'eb-001',
      title: 'Arsitektur Cloud & DevOps: Prinsip & Praktik Sistem Terdistribusi',
      author: 'Hendra Wijaya',
      pageCount: 450,
      category: 'Teknologi',
      sawRankLabel: 'Rank #2 SAW (V: 0.915)',
      isTopSawRank: false,
      formatLabel: 'PDF + EPUB',
      licenseLabel: '1 Lisensi Digital',
      coverUrl: AppAssets.coverArsitekturCloudDevops,
      price: 65000,
      originalPrice: 95000,
      ratingAvg: 4.9,
      isSelected: true,
    ),
    CartItemModel(
      id: 'eb-007',
      title: 'Desain Sistem Modern: Skalabilitas Tinggi',
      author: 'Ahmad Fauzi',
      pageCount: 380,
      category: 'Rekayasa',
      sawRankLabel: 'Rank #1 SAW (V: 0.942)',
      isTopSawRank: true,
      formatLabel: 'PDF',
      licenseLabel: '1 Lisensi Digital',
      coverUrl: AppAssets.coverDesainSistemModern,
      price: 68000,
      originalPrice: null,
      ratingAvg: 4.8,
      isSelected: true,
    ),
  ];

  static const List<CartItemModel> emptyStateSawRecommendations =
      <CartItemModel>[
    CartItemModel(
      id: 'eb-001',
      title: 'Arsitektur Cloud Modern',
      author: 'Dian Pratama',
      pageCount: 320,
      category: 'TECH',
      sawRankLabel: 'V_i: 0.942',
      isTopSawRank: true,
      formatLabel: 'EPUB/PDF',
      licenseLabel: '1 Lisensi Digital',
      coverUrl: AppAssets.coverArsitekturCloudDevops,
      price: 45000,
      ratingAvg: 4.8,
      isSelected: true,
    ),
    CartItemModel(
      id: 'eb-002',
      title: 'Sistem Keputusan SAW',
      author: 'Budi Raharjo',
      pageCount: 280,
      category: 'DATA',
      sawRankLabel: 'V_i: 0.915',
      isTopSawRank: false,
      formatLabel: 'SAW CORE',
      licenseLabel: '1 Lisensi Digital',
      coverUrl: AppAssets.coverAlgoritmaStrukturData,
      price: 38000,
      ratingAvg: 4.9,
      isSelected: true,
    ),
  ];

  @override
  Future<List<CartItem>> getCartItems() async {
    return List<CartItem>.unmodifiable(initialCartItems);
  }

  @override
  Future<List<CartItem>> getRecommendedSawItems() async {
    return List<CartItem>.unmodifiable(emptyStateSawRecommendations);
  }

  @override
  Future<CartPromo> validatePromoCode(String code) async {
    final normalized = code.trim().toUpperCase();
    for (final promo in _availablePromos) {
      if (promo.code == normalized) {
        return promo;
      }
    }
    throw const CartFailure.invalidPromo();
  }
}
