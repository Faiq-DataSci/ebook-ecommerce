import '../../domain/entities/user_profile_entity.dart';
import '../../domain/repositories/profile_repository.dart';
import '../datasources/profile_mock_datasource.dart';
import '../datasources/profile_remote_datasource.dart';

class ProfileRepositoryImpl implements ProfileRepository {
  final ProfileRemoteDataSource remoteDataSource;
  final ProfileMockDataSource mockDataSource;
  final bool useRemote;

  const ProfileRepositoryImpl({
    required this.remoteDataSource,
    required this.mockDataSource,
    this.useRemote = false,
  });

  ProfileRemoteDataSource get _source =>
      useRemote ? remoteDataSource : mockDataSource;

  @override
  Future<UserProfileEntity> getProfile() => _source.getProfile();

  @override
  Future<UserProfileEntity> updateProfile({String? fullName, String? phone}) =>
      _source.updateProfile(fullName: fullName, phone: phone);
}
