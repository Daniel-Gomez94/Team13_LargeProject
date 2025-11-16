import 'dart:convert';
import 'package:http/http.dart' as http;

abstract class ApiClient {
  Future<http.Response> post(String path, Map<String, dynamic> body);
  Future<http.Response> get(String path);
}

class ApiService implements ApiClient {
  ApiService({http.Client? client, this.baseUrl = 'https://codele.xyz'})
      : _client = client ?? http.Client();

  final http.Client _client;
  final String baseUrl;

  @override
  Future<http.Response> post(String path, Map<String, dynamic> body) {
    final uri = _resolve(path);
    return _client.post(
      uri,
      headers: const {'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );
  }

  @override
  Future<http.Response> get(String path) {
    final uri = _resolve(path);
    return _client.get(uri);
  }

  Uri _resolve(String path) {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return Uri.parse(path);
    }
    return Uri.parse('$baseUrl$path');
  }
}
