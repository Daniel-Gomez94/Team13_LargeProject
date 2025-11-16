import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/pages/login_page.dart';
import 'package:mobile/pages/verify_email_page.dart';
import 'utils/fake_api_client.dart';

void main() {
  testWidgets('verifying email navigates back to login',
      (WidgetTester tester) async {
    final fakeApi = FakeApiClient();
    fakeApi.setPostHandler(
      '/api/verify-email',
      (body) async => jsonResponse({'success': true}, 200),
    );

    await tester.pumpWidget(
      MaterialApp(
        home: VerifyEmailPage(email: 'knight@ucf.edu', apiClient: fakeApi),
      ),
    );

    await tester.enterText(
      find.byKey(const Key('verify_code_field')),
      '123456',
    );
    await tester.tap(find.byKey(const Key('verify_submit_button')));
    await tester.pump();
    await tester.pump(const Duration(seconds: 3));
    await tester.pump();

    expect(find.byType(LoginPage), findsOneWidget);
  });

  testWidgets('resending code shows success message',
      (WidgetTester tester) async {
    final fakeApi = FakeApiClient();
    fakeApi.setPostHandler(
      '/api/resend-verification',
      (body) async => jsonResponse({'success': true}, 200),
    );

    await tester.pumpWidget(
      MaterialApp(
        home: VerifyEmailPage(email: 'knight@ucf.edu', apiClient: fakeApi),
      ),
    );

    await tester.tap(find.byKey(const Key('verify_resend_button')));
    await tester.pump();

    expect(
      find.text('Verification code resent! Check your email.'),
      findsOneWidget,
    );
  });
}
