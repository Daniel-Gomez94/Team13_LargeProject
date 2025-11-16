import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/gradient.dart';
import '../widgets/glow.dart';
import 'dart:convert';
import 'login_page.dart';
import '../services/theme_service.dart';
import '../services/api_service.dart';

class VerifyEmailPage extends StatefulWidget {
  final String email;
  VerifyEmailPage({super.key, required this.email, ApiClient? apiClient})
      : apiClient = apiClient ?? ApiService();

  final ApiClient apiClient;

  @override
  State<VerifyEmailPage> createState() => _VerifyEmailPageState();
}

class _VerifyEmailPageState extends State<VerifyEmailPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;

  final TextEditingController _codeController = TextEditingController();
  String _errorMessage = '';
  String _successMessage = '';
  bool _isLoading = false;
  bool _isResending = false;

  Future<void> _verifyEmail() async {
    if (_codeController.text.trim().isEmpty) {
      setState(() {
        _errorMessage = 'Please enter the verification code';
      });
      return;
    }

    if (_codeController.text.trim().length != 6) {
      setState(() {
        _errorMessage = 'Verification code must be 6 digits';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = '';
      _successMessage = '';
    });

    try {
      final response = await widget.apiClient.post('/api/verify-email', {
        'email': widget.email,
        'code': _codeController.text.trim(),
      });

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        // Verification successful
        setState(() {
          _successMessage = 'Email verified successfully!';
        });

        // Wait a moment to show success message
        await Future.delayed(const Duration(seconds: 2));

        if (mounted) {
          // Navigate to login page
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => LoginPage(
                apiClient: widget.apiClient,
              ),
            ),
          );
        }
      } else {
        setState(() {
          _errorMessage = data['error'] ?? 'Verification failed';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Network error. Please check your connection.';
      });
      print('Verification error: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _resendCode() async {
    setState(() {
      _isResending = true;
      _errorMessage = '';
      _successMessage = '';
    });

    try {
      final response = await widget.apiClient.post(
        '/api/resend-verification',
        {'email': widget.email},
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        setState(() {
          _successMessage = 'Verification code resent! Check your email.';
        });
      } else {
        setState(() {
          _errorMessage = data['error'] ?? 'Failed to resend code';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Network error. Please try again.';
      });
      print('Resend error: $e');
    } finally {
      setState(() {
        _isResending = false;
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
    _codeController.dispose();
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
            child: _buildVerifyCard(),
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

  Widget _buildVerifyCard() {
    return IntrinsicHeight(
      child: Container(
        decoration: AppTheme.cardDecoration,
        padding: const EdgeInsets.all(18.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildAnimatedEnvelope(),
            GradientText(
              text: 'Verify Your Email',
              style: AppTheme.headingStyle,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            Text(
              'We sent a 6-digit verification code to:',
              style: TextStyle(
                color: AppTheme.accentColor.withOpacity(0.7),
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              widget.email,
              style: TextStyle(
                color: AppTheme.accentColor,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            _buildCodeField(),
            const SizedBox(height: 24),
            _buildVerifyButton(),
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
            if (_successMessage.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 18),
                child: Text(
                  _successMessage,
                  style: const TextStyle(color: Colors.green, fontSize: 14),
                  textAlign: TextAlign.center,
                ),
              ),
            const Divider(color: AppTheme.primaryGold, thickness: 2),
            const SizedBox(height: 18),
            _buildResendSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildAnimatedEnvelope() {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _animation.value),
          child: child,
        );
      },
      child: Text(
        '📧',
        style: TextStyle(fontSize: 48, fontWeight: FontWeight.bold),
        textAlign: TextAlign.center,
      ),
    );
  }

  Widget _buildCodeField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ValueListenableBuilder<bool>(
          valueListenable: ThemeService.isDarkMode,
          builder: (context, _, __) =>
              Text('🔢 VERIFICATION CODE', style: AppTheme.labelStyle),
        ),
        const SizedBox(height: 8),
        TextField(
          key: const Key('verify_code_field'),
          controller: _codeController,
          style: AppTheme.defaultStyle,
          decoration: AppTheme.inputDecoration('Enter 6-digit code'),
          keyboardType: TextInputType.number,
          maxLength: 6,
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildVerifyButton() {
    return GlowingContainer(
      child: ElevatedButton(
        key: const Key('verify_submit_button'),
        onPressed: _isLoading ? null : _verifyEmail,
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
            : const Text('✅ VERIFY EMAIL', style: AppTheme.buttonTextStyle),
      ),
    );
  }

  Widget _buildResendSection() {
    return Column(
      children: [
        Text(
          "Didn't receive the code?",
          style: TextStyle(
            color: AppTheme.accentColor.withOpacity(0.5),
            fontSize: 16,
          ),
          textAlign: TextAlign.center,
        ),
        ElevatedButton(
          key: const Key('verify_resend_button'),
          onPressed: _isResending ? null : _resendCode,
          style: AppTheme.secondaryButtonStyle,
          child: _isResending
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      AppTheme.primaryGold,
                    ),
                  ),
                )
              : const Text('📬 Resend Code', style: AppTheme.buttonTextStyle),
        ),
      ],
    );
  }
}
