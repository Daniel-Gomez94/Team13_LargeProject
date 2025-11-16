import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/main.dart';
import 'package:mobile/pages/login_page.dart';
import 'package:mobile/services/theme_service.dart';

void main() {
  setUp(() {
    // Each test should start from a deterministic theme state.
    ThemeService.isDarkMode.value = true;
  });

  testWidgets('MyApp shows the login page as its home screen',
      (WidgetTester tester) async {
    await tester.pumpWidget(MyApp());
    expect(find.byType(LoginPage), findsOneWidget);
  });

  testWidgets('MyApp reacts to ThemeService changes',
      (WidgetTester tester) async {
    await tester.pumpWidget(MyApp());

    MaterialApp materialApp = tester.widget(find.byType(MaterialApp));
    expect(materialApp.themeMode, ThemeMode.dark);

    ThemeService.toggle();
    await tester.pump();

    materialApp = tester.widget(find.byType(MaterialApp));
    expect(materialApp.themeMode, ThemeMode.light);
  });
}
