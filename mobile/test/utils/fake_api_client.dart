import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/services/api_service.dart';

typedef PostHandler = Future<http.Response> Function(
    Map<String, dynamic> body);
typedef GetHandler = Future<http.Response> Function();

class FakeApiClient implements ApiClient {
  FakeApiClient({
    Map<String, PostHandler>? postHandlers,
    Map<String, GetHandler>? getHandlers,
  })  : _postHandlers = postHandlers ?? {},
        _getHandlers = getHandlers ?? {};

  final Map<String, PostHandler> _postHandlers;
  final Map<String, GetHandler> _getHandlers;

  void setPostHandler(String path, PostHandler handler) {
    _postHandlers[path] = handler;
  }

  void setGetHandler(String path, GetHandler handler) {
    _getHandlers[path] = handler;
  }

  @override
  Future<http.Response> post(String path, Map<String, dynamic> body) {
    final handler = _postHandlers[path];
    if (handler != null) {
      return handler(body);
    }
    return Future.value(
      http.Response(jsonEncode({'error': 'Unhandled POST $path'}), 500),
    );
  }

  @override
  Future<http.Response> get(String path) {
    final handler = _getHandlers[path];
    if (handler != null) {
      return handler();
    }
    return Future.value(
      http.Response(jsonEncode({'error': 'Unhandled GET $path'}), 500),
    );
  }
}

http.Response jsonResponse(Map<String, dynamic> data, int statusCode) {
  return http.Response(jsonEncode(data), statusCode);
}
