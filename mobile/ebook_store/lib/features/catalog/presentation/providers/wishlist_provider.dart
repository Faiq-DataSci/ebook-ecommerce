import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/datasources/wishlist_local_datasource.dart';

final wishlistLocalDataSourceProvider = Provider<WishlistLocalDataSource>((
  ref,
) {
  return WishlistLocalDataSourceImpl();
});

class WishlistNotifier extends StateNotifier<Set<String>> {
  final WishlistLocalDataSource localDataSource;

  WishlistNotifier({
    required this.localDataSource,
    Set<String> initialWishlist = const <String>{},
    bool autoLoad = true,
  }) : super(initialWishlist) {
    if (autoLoad) {
      loadWishlist();
    }
  }

  Future<void> loadWishlist() async {
    final saved = await localDataSource.getWishlist();
    if (saved.isNotEmpty) {
      state = saved;
    }
  }

  bool toggleWishlist(String ebookId) {
    final current = Set<String>.from(state);
    final bool willAdd = !current.contains(ebookId);
    if (willAdd) {
      current.add(ebookId);
    } else {
      current.remove(ebookId);
    }
    state = current;
    localDataSource.saveWishlist(current);
    return willAdd;
  }

  bool isWishlisted(String ebookId) => state.contains(ebookId);

  void clearAll() {
    state = const <String>{};
    localDataSource.clearWishlist();
  }
}

final wishlistProvider = StateNotifierProvider<WishlistNotifier, Set<String>>((
  ref,
) {
  final localDs = ref.watch(wishlistLocalDataSourceProvider);
  return WishlistNotifier(localDataSource: localDs);
});
