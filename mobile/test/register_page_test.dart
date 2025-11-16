import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/pages/register_page.dart';
import 'package:mobile/pages/verify_email_page.dart';
import 'utils/fake_api_client.dart';

void main() {
  testWidgets('successful registration navigates to verify email page',
      (WidgetTester tester) async {
    final fakeApi = FakeApiClient();
    fakeApi.setPostHandler(
      '/api/register',
      (body) async => jsonResponse({'error': ''}, 200),
    );

    await tester.pumpWidget(
      MaterialApp(home: RegisterPage(apiClient: fakeApi)),
    );

    await tester.enterText(
      find.byKey(const Key('register_first_name_field')),
      'Code',
    );
    await tester.enterText(
      find.byKey(const Key('register_last_name_field')),
      'Knight',
    );
    await tester.enterText(
      find.byKey(const Key('register_email_field')),
      'knight@ucf.edu',
    );
    await tester.enterText(
      find.byKey(const Key('register_password_field')),
      'securePass1',
    );
    await tester.enterText(
      find.byKey(const Key('register_confirm_password_field')),
      'securePass1',
    );

    final submitFinder = find.byKey(const Key('register_submit_button'));
    await tester.ensureVisible(submitFinder);
    await tester.tap(submitFinder);
    await tester.pump();
    for (var i = 0; i < 6; i++) {
      await tester.pump(const Duration(milliseconds: 200));
    }

    expect(find.byType(VerifyEmailPage), findsOneWidget);
  });

  testWidgets('password mismatch displays validation error',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(home: RegisterPage()),
    );

    await tester.enterText(
      find.byKey(const Key('register_first_name_field')),
      'Code',
    );
    await tester.enterText(
      find.byKey(const Key('register_last_name_field')),
      'Knight',
    );
    await tester.enterText(
      find.byKey(const Key('register_email_field')),
      'knight@ucf.edu',
    );
    await tester.enterText(
      find.byKey(const Key('register_password_field')),
      'securePass1',
    );
    await tester.enterText(
      find.byKey(const Key('register_confirm_password_field')),
      'different',
    );

    final submitFinder = find.byKey(const Key('register_submit_button'));
    await tester.ensureVisible(submitFinder);
    await tester.tap(submitFinder);
    await tester.pump();

    expect(find.text('Passwords do not match'), findsOneWidget);
  });
}
