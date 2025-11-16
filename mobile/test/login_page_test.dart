import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/pages/leaderboard_page.dart';
import 'package:mobile/pages/login_page.dart';
import 'utils/fake_api_client.dart';

void main() {
  testWidgets('successful login navigates to leaderboard',
      (WidgetTester tester) async {
    final fakeApi = FakeApiClient();
    fakeApi.setPostHandler('/api/login', (body) async {
      expect(body['email'], 'knight@ucf.edu');
      return jsonResponse({
        'error': '',
        'id': 42,
        'firstName': 'Code',
        'lastName': 'Knight'
      }, 200);
    });
    fakeApi.setGetHandler(
      '/api/leaderboard/score',
      () async => jsonResponse({'leaderboard': []}, 200),
    );

    await tester.pumpWidget(
      MaterialApp(home: LoginPage(apiClient: fakeApi)),
    );

    await tester.enterText(
      find.byKey(const Key('login_email_field')),
      'knight@ucf.edu',
    );
    await tester.enterText(
      find.byKey(const Key('login_password_field')),
      'password123',
    );
    await tester.tap(find.byKey(const Key('login_submit_button')));
    await tester.pumpAndSettle();

    expect(find.byType(LeaderboardPage), findsOneWidget);
  });

  testWidgets('shows error when API returns an error message',
      (WidgetTester tester) async {
    final fakeApi = FakeApiClient();
    fakeApi.setPostHandler(
      '/api/login',
      (body) async => jsonResponse({'error': 'Invalid credentials'}, 200),
    );

    await tester.pumpWidget(
      MaterialApp(home: LoginPage(apiClient: fakeApi)),
    );

    await tester.enterText(
      find.byKey(const Key('login_email_field')),
      'knight@ucf.edu',
    );
    await tester.enterText(
      find.byKey(const Key('login_password_field')),
      'wrong',
    );
    await tester.tap(find.byKey(const Key('login_submit_button')));
    await tester.pump();

    expect(find.text('Invalid credentials'), findsOneWidget);
  });
}
