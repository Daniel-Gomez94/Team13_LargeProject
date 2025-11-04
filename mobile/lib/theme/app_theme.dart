import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryGold = Color(0xFFFFC904);
  static const Color darkGold = Color(0xFFb58500);
  static const Color darkBackground = Color(0xFF1a1a1a);
  static const Color darkerBackground = Color(0xFF2a2a2a);
  static const Color black = Colors.black;

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
  static const TextStyle labelStyle = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: primaryGold,
  );
  static const TextStyle defaultStyle = TextStyle(
    fontSize: 16,
    color: primaryGold,
  );
  static const TextStyle buttonTextStyle = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.bold,
  );

  static InputDecoration inputDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: TextStyle(color: primaryGold.withOpacity(0.5)),
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
  static ButtonStyle secondaryButtonStyle = ElevatedButton.styleFrom(
    backgroundColor: Colors.transparent,
    foregroundColor: primaryGold,
  );

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

  static BoxDecoration cardDecoration = BoxDecoration(
    borderRadius: BorderRadius.circular(16),
    color: darkBackground,
    border: Border.all(color: primaryGold, width: 2),
  );

  static ThemeData get theme {
    return ThemeData(
      primaryColor: primaryGold,
      scaffoldBackgroundColor: black,
      useMaterial3: true,
      appBarTheme: const AppBarTheme(
        backgroundColor: black,
        centerTitle: true,
        toolbarHeight: 80,
      ),
    );
  }
}
