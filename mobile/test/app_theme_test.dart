import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/services/theme_service.dart';
import 'package:mobile/theme/app_theme.dart';

void main() {
  setUp(() {
    ThemeService.isDarkMode.value = true;
  });

  test('AppTheme surfaces dark themed values when dark mode is enabled', () {
    expect(AppTheme.darkBackground, AppTheme.darkBackgroundConst);
    expect(AppTheme.darkerBackground, AppTheme.darkerBackgroundConst);
    expect(AppTheme.accentColor, AppTheme.primaryGold);
  });

  test('AppTheme switches to light values when dark mode is disabled', () {
    ThemeService.isDarkMode.value = false;

    expect(AppTheme.darkBackground, AppTheme.lightBackgroundConst);
    expect(AppTheme.darkerBackground, AppTheme.lighterBackgroundConst);
    expect(AppTheme.accentColor, Colors.black);
  });

  test('inputDecoration picks label colors based on theme state', () {
    final darkDecoration = AppTheme.inputDecoration('Email');
    expect(darkDecoration.labelStyle?.color,
        AppTheme.primaryGold.withOpacity(0.5));

    ThemeService.isDarkMode.value = false;
    final lightDecoration = AppTheme.inputDecoration('Email');
    expect(lightDecoration.labelStyle?.color, AppTheme.darkGold);
  });
}
