import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/pages/forgot_password_page.dart';
import 'package:mobile/pages/reset_password_verify.dart';
import 'utils/fake_api_client.dart';

void main() {
  testWidgets('requesting reset code navigates to verification screen',
      (WidgetTester tester) async {
    final fakeApi = FakeApiClient();
    fakeApi.setPostHandler(
      '/api/forgot-password',
      (body) async => jsonResponse({'error': ''}, 200),
    );

    await tester.pumpWidget(
      MaterialApp(home: ForgotPasswordPage(apiClient: fakeApi)),
    );

    await tester.enterText(
      find.byKey(const Key('forgot_email_field')),
      'knight@ucf.edu',
    );
    await tester.tap(find.byKey(const Key('forgot_send_code_button')));
    await tester.pump();
    for (var i = 0; i < 6; i++) {
      await tester.pump(const Duration(milliseconds: 200));
    }

    expect(find.byType(ResetPasswordVerifyPage), findsOneWidget);
  });
}
