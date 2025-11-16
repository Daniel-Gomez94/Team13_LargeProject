import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/pages/login_page.dart';
import 'package:mobile/pages/reset_password_verify.dart';
import 'utils/fake_api_client.dart';

void main() {
  testWidgets('submitting reset navigates back to login',
      (WidgetTester tester) async {
    final fakeApi = FakeApiClient();
    fakeApi.setPostHandler(
      '/api/reset-password',
      (body) async => jsonResponse({'error': ''}, 200),
    );

    await tester.pumpWidget(
      MaterialApp(
        home: ResetPasswordVerifyPage(
          email: 'knight@ucf.edu',
          apiClient: fakeApi,
        ),
      ),
    );

    await tester.enterText(
      find.byKey(const Key('reset_code_field')),
      '123456',
    );
    await tester.enterText(
      find.byKey(const Key('reset_new_password_field')),
      'newSecret1',
    );
    await tester.enterText(
      find.byKey(const Key('reset_confirm_password_field')),
      'newSecret1',
    );

    final submitFinder = find.byKey(const Key('reset_submit_button'));
    await tester.ensureVisible(submitFinder);
    await tester.tap(submitFinder);
    await tester.pump();
    for (var i = 0; i < 6; i++) {
      await tester.pump(const Duration(milliseconds: 200));
    }

    expect(find.byType(LoginPage), findsOneWidget);
  });

  testWidgets('resend displays success message', (WidgetTester tester) async {
    final fakeApi = FakeApiClient();
    fakeApi.setPostHandler(
      '/api/forgot-password',
      (body) async => jsonResponse({'success': true}, 200),
    );

    await tester.pumpWidget(
      MaterialApp(
        home: ResetPasswordVerifyPage(
          email: 'knight@ucf.edu',
          apiClient: fakeApi,
        ),
      ),
    );

    final resendFinder = find.byKey(const Key('reset_resend_button'));
    await tester.ensureVisible(resendFinder);
    await tester.tap(resendFinder);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(
      find.text('Reset code resent! Check your email.'),
      findsOneWidget,
    );
  });
}
