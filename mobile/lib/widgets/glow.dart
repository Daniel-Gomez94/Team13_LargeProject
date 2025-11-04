import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class GlowingContainer extends StatelessWidget {
  final Widget child;
  final double opacity;

  const GlowingContainer({super.key, required this.child, this.opacity = 0.5});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        boxShadow: AppTheme.goldGlowShadow(opacity: opacity),
      ),
      child: child,
    );
  }
}
