// import 'dart:io';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const App());
}

class App extends StatefulWidget {
  const App({super.key});
  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  late final WebViewController _controller;
  bool _loading = true;

  // Choose a sensible default for dev vs prod:
  // - Emulator -> 'http://10.0.2.2:5000' to reach the local backend
  // - Device on same LAN -> use your PC LAN IP + :5000
  // - Production -> 'http://143.198.228.249:5000'
  static const String defaultUrl =
      String.fromEnvironment('BASE_URL', defaultValue: 'http://10.0.2.2:5000');

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) => setState(() => _loading = true),
          onPageFinished: (_) => setState(() => _loading = false),
        ),
      )
      ..loadRequest(Uri.parse(defaultUrl));
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Team13',
      theme: ThemeData(useMaterial3: true),
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Team13'),
          actions: [
            IconButton(
              onPressed: () => _controller.reload(),
              icon: const Icon(Icons.refresh),
            ),
          ],
        ),
        body: Stack(
          children: [
            WebViewWidget(controller: _controller),
            if (_loading) const LinearProgressIndicator(minHeight: 3),
          ],
        ),
      ),
    );
  }
}
