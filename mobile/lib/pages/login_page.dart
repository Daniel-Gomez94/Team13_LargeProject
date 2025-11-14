import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../services/theme_service.dart';
import '../widgets/gradient.dart';
import '../widgets/glow.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'register_page.dart';
import 'leaderboard_page.dart';
import 'forgot_password_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;

  final TextEditingController _loginController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String _errorMessage = '';
  bool _isLoading = false;

  Future<void> _login() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final response = await http.post(
        Uri.parse("https://codele.xyz/api/login"),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': _loginController.text,
          'password': _passwordController.text,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['error'] == null || data['error'].isEmpty) {
          // Login successful - navigate to leaderboard
          print('Login successful! User ID: ${data['id']}');

          // Navigate to leaderboard page
          if (mounted) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => LeaderboardPage(
                  userId: data['id'] is String
                      ? int.parse(data['id'])
                      : data['id'],
                  userName: '${data['firstName']} ${data['lastName']}'.trim(),
                ),
              ),
            );
          }
        } else {
          setState(() {
            _errorMessage = data['error'];
          });
        }
      } else if (response.statusCode == 403) {
        final data = jsonDecode(response.body);
        setState(() {
          _errorMessage = data['error'];
        });
      } else {
        setState(() {
          _errorMessage = 'Login failed. Please try again.';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Network error. Please check your connection.';
      });
      print('Login error: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _animation = Tween<double>(begin: -10.0, end: 10.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    _loginController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _buildAppBar(),
      body: Center(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(32.0, 8.0, 32.0, 32.0),
            child: _buildLoginCard(),
          ),
        ),
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      title: Padding(
        padding: const EdgeInsets.only(top: 16),
        child: Container(
          decoration: BoxDecoration(
            boxShadow: AppTheme.goldGlowShadow(opacity: 0.3),
          ),
          child: GradientText(text: 'CODELE', style: AppTheme.titleStyle),
        ),
      ),
    );
  }

  Widget _buildLoginCard() {
    return IntrinsicHeight(
      child: Container(
        decoration: AppTheme.cardDecoration,
        padding: const EdgeInsets.all(18.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildAnimatedCastle(),
            GradientText(
              text: 'Welcome Back, Knight!',
              style: AppTheme.headingStyle,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            _buildEmailField(),
            const SizedBox(height: 24),
            _buildPasswordField(),
            const SizedBox(height: 8),
            _buildForgotPasswordButton(),
            const SizedBox(height: 24),
            _buildLoginButton(),
            const SizedBox(height: 18),
            if (_errorMessage.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 18),
                child: Text(
                  _errorMessage,
                  style: const TextStyle(color: Colors.red, fontSize: 14),
                  textAlign: TextAlign.center,
                ),
              ),
            const Divider(color: AppTheme.primaryGold, thickness: 2),
            const SizedBox(height: 18),
            _buildRegisterSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildAnimatedCastle() {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _animation.value),
          child: child,
        );
      },
      child: Text(
        '🏰',
        style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
        textAlign: TextAlign.center,
      ),
    );
  }

  Widget _buildEmailField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ValueListenableBuilder<bool>(
          valueListenable: ThemeService.isDarkMode,
          builder: (context, _, __) =>
              Text('📧 EMAIL ADDRESS', style: AppTheme.labelStyle),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _loginController,
          style: AppTheme.defaultStyle,
          decoration: AppTheme.inputDecoration('knight@ucf.edu'),
          keyboardType: TextInputType.emailAddress,
        ),
      ],
    );
  }

  Widget _buildPasswordField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ValueListenableBuilder<bool>(
          valueListenable: ThemeService.isDarkMode,
          builder: (context, _, __) =>
              Text('🔒 PASSWORD', style: AppTheme.labelStyle),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _passwordController,
          style: AppTheme.defaultStyle,
          obscureText: true,
          decoration: AppTheme.inputDecoration('Enter your password'),
        ),
      ],
    );
  }

  Widget _buildForgotPasswordButton() {
    return Align(
      alignment: Alignment.centerRight,
      child: TextButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const ForgotPasswordPage()),
          );
        },
        child: Text(
          'Forgot Password?',
          style: TextStyle(
            color: AppTheme.accentColor,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildLoginButton() {
    return GlowingContainer(
      child: ElevatedButton(
        onPressed: _isLoading ? null : _login,
        style: AppTheme.primaryButtonStyle,
        child: _isLoading
            ? const SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(AppTheme.black),
                ),
              )
            : const Text('⚔️ LOGIN', style: AppTheme.buttonTextStyle),
      ),
    );
  }

  Widget _buildRegisterSection() {
    return Column(
      children: [
        Text(
          "Don't have an account?",
          style: TextStyle(
            color: AppTheme.accentColor.withOpacity(0.5),
            fontSize: 16,
          ),
          textAlign: TextAlign.center,
        ),
        ValueListenableBuilder<bool>(
          valueListenable: ThemeService.isDarkMode,
          builder: (context, _, __) => ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const RegisterPage()),
              );
            },
            style: AppTheme.secondaryButtonStyle,
            child: const Text(
              '✨ Register Now',
              style: AppTheme.buttonTextStyle,
            ),
          ),
        ),
      ],
    );
  }
}
