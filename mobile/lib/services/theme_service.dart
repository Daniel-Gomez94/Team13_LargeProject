import 'package:flutter/material.dart';

class ThemeService {
  ThemeService._();
  static final ValueNotifier<bool> isDarkMode = ValueNotifier<bool>(true);
  static void toggle() => isDarkMode.value = !isDarkMode.value;
}
