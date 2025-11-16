import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/services/theme_service.dart';

void main() {
  setUp(() {
    ThemeService.isDarkMode.value = true;
  });

  test('ThemeService exposes a ValueNotifier for theme changes', () {
    expect(ThemeService.isDarkMode.value, isTrue);
  });

  test('toggle flips the theme value and notifies listeners', () {
    int notificationCount = 0;
    void listener() => notificationCount++;

    ThemeService.isDarkMode.addListener(listener);
    addTearDown(() => ThemeService.isDarkMode.removeListener(listener));

    ThemeService.toggle();
    expect(ThemeService.isDarkMode.value, isFalse);

    ThemeService.toggle();
    expect(ThemeService.isDarkMode.value, isTrue);
    expect(notificationCount, greaterThanOrEqualTo(1));
  });
}
