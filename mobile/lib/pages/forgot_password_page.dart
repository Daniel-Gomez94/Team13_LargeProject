import 'package:flutter/material.dart';
import 'package:mobile/pages/login_page.dart';
import 'package:mobile/pages/reset_password_verify.dart';
import '../theme/app_theme.dart';
import '../services/theme_service.dart';
import '../widgets/gradient.dart';
import '../widgets/glow.dart';
import 'dart:convert';
import '../services/api_service.dart';

class ForgotPasswordPage extends StatefulWidget {
  ForgotPasswordPage({super.key, ApiClient? apiClient})
      : apiClient = apiClient ?? ApiService();

  final ApiClient apiClient;

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;

  final TextEditingController _emailController = TextEditingController();
  String _errorMessage = '';
  bool _isLoading = false;

  Future<void> _sendResetCode() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final response = await widget.apiClient.post(
        '/api/forgot-password',
        {'email': _emailController.text},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['error'] == null || data['error'].isEmpty) {
          if (mounted) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => ResetPasswordVerifyPage(
                  email: _emailController.text,
                  apiClient: widget.apiClient,
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
          _errorMessage = 'Email failed to send. Please try again.';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Network error. Please check your connection.';
      });
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
    _emailController.dispose();
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
            _buildAnimatedLock(),
            GradientText(
              text: 'Forgot Password?',
              style: AppTheme.headingStyle,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              "Enter your email and we'll send you a code to reset your password",
              style: TextStyle(
                color: AppTheme.accentColor.withOpacity(0.7),
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            _buildEmailField(),
            const SizedBox(height: 24),
            _buildSendButton(),
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

  Widget _buildAnimatedLock() {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _animation.value),
          child: child,
        );
      },
      child: Text(
        '🔐',
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
          key: const Key('forgot_email_field'),
          controller: _emailController,
          style: AppTheme.defaultStyle,
          decoration: AppTheme.inputDecoration('knight@ucf.edu'),
          keyboardType: TextInputType.emailAddress,
        ),
      ],
    );
  }

  Widget _buildSendButton() {
    return GlowingContainer(
      child: ElevatedButton(
        key: const Key('forgot_send_code_button'),
        onPressed: _isLoading ? null : _sendResetCode,
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
            : const Text('⚔️ SEND RESET CODE', style: AppTheme.buttonTextStyle),
      ),
    );
  }

  Widget _buildRegisterSection() {
    return Column(
      children: [
        Text(
          "Remember your password?",
          style: TextStyle(
            color: AppTheme.accentColor.withOpacity(0.5),
            fontSize: 16,
          ),
          textAlign: TextAlign.center,
        ),
        ElevatedButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => LoginPage(
                  apiClient: widget.apiClient,
                ),
              ),
            );
          },
          style: AppTheme.secondaryButtonStyle,
          child: Text('⚔️ Back to Login', style: AppTheme.buttonTextStyle),
        ),
      ],
    );
  }
}
