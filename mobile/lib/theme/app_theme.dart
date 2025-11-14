import 'package:flutter/material.dart';
import '../services/theme_service.dart';

class AppTheme {
  static const Color primaryGold = Color(0xFFFFC904);
  static const Color darkGold = Color(0xFFb58500);
  static const Color darkBackgroundConst = Color(0xFF1a1a1a);
  static const Color darkerBackgroundConst = Color(0xFF2a2a2a);
  static const Color lightBackgroundConst = Color(0xFFFFFFFF);
  static const Color lighterBackgroundConst = Color(0xFFf5f5f5);
  static const Color black = Colors.black;

  // Context-agnostic getters that adapt to light/dark mode using ThemeService.
  static Color get darkBackground => ThemeService.isDarkMode.value
      ? darkBackgroundConst
      : lightBackgroundConst;

  static Color get darkerBackground => ThemeService.isDarkMode.value
      ? darkerBackgroundConst
      : lighterBackgroundConst;

  static Color get accentColor =>
      ThemeService.isDarkMode.value ? primaryGold : Colors.black;

  static const TextStyle titleStyle = TextStyle(
    fontSize: 36,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  );
  static const TextStyle headingStyle = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  );
  static TextStyle get labelStyle => TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: ThemeService.isDarkMode.value ? primaryGold : Colors.black,
  );
  static TextStyle get defaultStyle => TextStyle(
    fontSize: 16,
    color: ThemeService.isDarkMode.value ? primaryGold : Colors.black,
  );
  static const TextStyle buttonTextStyle = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.bold,
  );

  static InputDecoration inputDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: TextStyle(
        color: ThemeService.isDarkMode.value
            ? primaryGold.withOpacity(0.5)
            : darkGold,
      ),
      enabledBorder: OutlineInputBorder(
        borderSide: const BorderSide(color: primaryGold, width: 2),
        borderRadius: BorderRadius.circular(8),
      ),
      focusedBorder: OutlineInputBorder(
        borderSide: const BorderSide(color: darkGold, width: 4),
        borderRadius: BorderRadius.circular(8),
      ),
      fillColor: darkerBackground,
      filled: true,
    );
  }

  static ButtonStyle primaryButtonStyle = ElevatedButton.styleFrom(
    backgroundColor: primaryGold,
    foregroundColor: black,
    padding: const EdgeInsets.symmetric(vertical: 16),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
      side: const BorderSide(color: darkGold, width: 2),
    ),
  );
  static ButtonStyle get secondaryButtonStyle {
    final isDark = ThemeService.isDarkMode.value;
    return ElevatedButton.styleFrom(
      backgroundColor: isDark ? Colors.transparent : lighterBackgroundConst,
      foregroundColor: isDark ? primaryGold : Colors.black,
      elevation: 0,
      shadowColor: Colors.transparent,
      textStyle: const TextStyle(fontWeight: FontWeight.bold),
    );
  }

  static Shader goldGradientShader(Rect bounds) {
    return const LinearGradient(
      colors: [primaryGold, darkGold],
    ).createShader(bounds);
  }

  static List<BoxShadow> goldGlowShadow({double opacity = 0.5}) {
    return [
      BoxShadow(
        color: primaryGold.withOpacity(opacity),
        blurRadius: 15,
        spreadRadius: 3,
      ),
    ];
  }

  static BoxDecoration get cardDecoration {
    return BoxDecoration(
      borderRadius: BorderRadius.circular(16),
      color: darkBackground,
      border: Border.all(color: primaryGold, width: 2),
    );
  }

  static ThemeData get theme {
    return ThemeData(
      primaryColor: primaryGold,
      scaffoldBackgroundColor: black,
      useMaterial3: true,
      appBarTheme: AppBarTheme(
        backgroundColor: black,
        centerTitle: true,
        toolbarHeight: 80,
      ),
    );
  }

  // Dark theme (same as existing default theme)
  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: primaryGold,
      scaffoldBackgroundColor: darkBackground,
      useMaterial3: true,
      appBarTheme: AppBarTheme(
        backgroundColor: darkBackground,
        centerTitle: true,
        toolbarHeight: 80,
      ),
      // keep default text theme for dark theme
    );
  }

  // Light theme variant
  static ThemeData get lightTheme {
    return ThemeData(
      brightness: Brightness.light,
      primaryColor: primaryGold,
      scaffoldBackgroundColor: Colors.white,
      useMaterial3: true,
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.white,
        centerTitle: true,
        toolbarHeight: 80,
      ),
      // keep default text theme for light theme
    );
  }
}
