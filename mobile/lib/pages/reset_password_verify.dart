import 'package:flutter/material.dart';
import 'package:mobile/pages/login_page.dart';
import '../theme/app_theme.dart';
import '../widgets/gradient.dart';
import '../widgets/glow.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../services/theme_service.dart';

class ResetPasswordVerifyPage extends StatefulWidget {
  final String email;
  const ResetPasswordVerifyPage({required this.email, super.key});

  @override
  State<ResetPasswordVerifyPage> createState() =>
      _ResetPasswordVerifyPageState();
}

class _ResetPasswordVerifyPageState extends State<ResetPasswordVerifyPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;

  final TextEditingController _codeController = TextEditingController();
  final TextEditingController _newPasswordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();
  String _errorMessage = '';
  String _successMessage = '';
  bool _isLoading = false;
  bool _isResending = false;

  Future<void> _reset() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    if (_codeController.text.trim().isEmpty) {
      setState(() {
        _errorMessage = 'Please enter the reset code';
        _isLoading = false;
      });
      return;
    }

    if (_codeController.text.trim().length != 6) {
      setState(() {
        _errorMessage = 'Reset code must be 6 digits';
        _isLoading = false;
      });
      return;
    }

    if (_newPasswordController.text.isEmpty ||
        _confirmPasswordController.text.isEmpty) {
      setState(() {
        _errorMessage = 'Please enter and confirm your new password';
        _isLoading = false;
      });
      return;
    }

    if (_newPasswordController.text != _confirmPasswordController.text) {
      setState(() {
        _errorMessage = 'Passwords do not match';
        _isLoading = false;
      });
      return;
    }

    if (_newPasswordController.text.length < 6) {
      setState(() {
        _errorMessage = 'New Password must be at least 6 characters';
        _isLoading = false;
      });
      return;
    }

    try {
      final response = await http.post(
        Uri.parse("https://codele.xyz/api/reset-password"),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': widget.email,
          'code': _codeController.text,
          'newPassword': _newPasswordController.text,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['error'] == null || data['error'].isEmpty) {
          // Login successful - navigate to leaderboard
          print('Password reset successfully! Redirecting to login...');

          // Navigate to leaderboard page
          if (mounted) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => LoginPage()),
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

  Future<void> _resendCode() async {
    setState(() {
      _isResending = true;
      _errorMessage = '';
    });

    try {
      final response = await http.post(
        Uri.parse("https://codele.xyz/api/forgot-password"),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': widget.email}),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        setState(() {
          _successMessage = 'Reset code resent! Check your email.';
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
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
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
              text: 'Reset Your Password',
              style: AppTheme.headingStyle,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            Text(
              "Enter the code sent to email and your new password",
              style: TextStyle(
                color: AppTheme.accentColor.withOpacity(0.7),
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            _buildCodeField(),
            const SizedBox(height: 24),
            _buildNewPasswordField(),
            const SizedBox(height: 24),
            _buildConfirmPasswordField(),
            const SizedBox(height: 24),
            _buildResetButton(),
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

  Widget _buildCodeField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ValueListenableBuilder<bool>(
          valueListenable: ThemeService.isDarkMode,
          builder: (context, _, __) =>
              Text('🔢 RESET CODE', style: AppTheme.labelStyle),
        ),
        const SizedBox(height: 8),
        TextField(
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

  Widget _buildNewPasswordField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ValueListenableBuilder<bool>(
          valueListenable: ThemeService.isDarkMode,
          builder: (context, _, __) =>
              Text('🔒 NEW PASSWORD', style: AppTheme.labelStyle),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _newPasswordController,
          style: AppTheme.defaultStyle,
          obscureText: true,
          decoration: AppTheme.inputDecoration('Enter new password'),
        ),
      ],
    );
  }

  Widget _buildConfirmPasswordField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ValueListenableBuilder<bool>(
          valueListenable: ThemeService.isDarkMode,
          builder: (context, _, __) =>
              Text('🔒 CONFIRM PASSWORD', style: AppTheme.labelStyle),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _confirmPasswordController,
          style: AppTheme.defaultStyle,
          obscureText: true,
          decoration: AppTheme.inputDecoration('Re-enter new password'),
        ),
      ],
    );
  }

  Widget _buildResetButton() {
    return GlowingContainer(
      child: ElevatedButton(
        onPressed: _isLoading ? null : _reset,
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
            : const Text('✅ RESET PASSWORD', style: AppTheme.buttonTextStyle),
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
