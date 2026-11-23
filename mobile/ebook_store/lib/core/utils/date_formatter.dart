const List<String> _monthsId = <String>[
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

/// Formats a date-time in the device's local zone as `18 Okt 2024 • 14:32`.
String formatDateTimeId(DateTime value) {
  final local = value.toLocal();
  final day = local.day.toString().padLeft(2, '0');
  final hour = local.hour.toString().padLeft(2, '0');
  final minute = local.minute.toString().padLeft(2, '0');
  return '$day ${_monthsId[local.month - 1]} ${local.year} \u2022 $hour:$minute';
}
