import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/gradient.dart';
import '../widgets/glow.dart';
import 'dart:convert';
import 'verify_email_page.dart';
import 'login_page.dart';
import '../services/theme_service.dart';
import '../services/api_service.dart';

class RegisterPage extends StatefulWidget {
  RegisterPage({super.key, ApiClient? apiClient})
      : apiClient = apiClient ?? ApiService();

  final ApiClient apiClient;

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;

  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  String _errorMessage = '';
  bool _isLoading = false;

  Future<void> _register() async {
    // Validate inputs
    if (_firstNameController.text.trim().isEmpty ||
        _lastNameController.text.trim().isEmpty ||
        _emailController.text.trim().isEmpty ||
        _passwordController.text.trim().isEmpty ||
        _confirmPasswordController.text.trim().isEmpty) {
      setState(() {
        _errorMessage = 'All fields are required';
      });
      return;
    }

    if (_passwordController.text != _confirmPasswordController.text) {
      setState(() {
        _errorMessage = 'Passwords do not match';
      });
      return;
    }

    if (_passwordController.text.length < 6) {
      setState(() {
        _errorMessage = 'Password must be at least 6 characters';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final response = await widget.apiClient.post('/api/register', {
        'firstName': _firstNameController.text.trim(),
        'lastName': _lastNameController.text.trim(),
        'email': _emailController.text.trim(),
        'password': _passwordController.text.trim(),
      });

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['error'] == null || data['error'].isEmpty) {
          // Registration successful - navigate to verification page
          print('Registration successful! Verification required.');

          if (mounted) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => VerifyEmailPage(
                  email: _emailController.text.trim(),
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
      } else if (response.statusCode == 400) {
        final data = jsonDecode(response.body);
        setState(() {
          _errorMessage = data['error'] ?? 'Registration failed';
        });
      } else {
        setState(() {
          _errorMessage = 'Registration failed. Please try again.';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Network error. Please check your connection.';
      });
      print('Registration error: $e');
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
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
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
            child: _buildRegisterCard(),
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

  Widget _buildRegisterCard() {
    return IntrinsicHeight(
      child: Container(
        decoration: AppTheme.cardDecoration,
        padding: const EdgeInsets.all(18.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildAnimatedSwords(),
            GradientText(
              text: 'Join the Knights!',
              style: AppTheme.headingStyle,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            _buildFNameField(),
            const SizedBox(height: 24),
            _buildLNameField(),
            const SizedBox(height: 24),
            _buildEmailField(),
            const SizedBox(height: 24),
            _buildPasswordField(),
            const SizedBox(height: 24),
            _buildConfirmPasswordField(),
            const SizedBox(height: 24),
            _buildRegisterButton(),
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
            _buildLoginSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildAnimatedSwords() {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _animation.value),
          child: child,
        );
      },
      child: Text(
        '⚔️',
        style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
        textAlign: TextAlign.center,
      ),
    );
  }

  Widget _buildFNameField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ValueListenableBuilder<bool>(
          valueListenable: ThemeService.isDarkMode,
          builder: (context, _, __) =>
              Text('👤 FIRST NAME', style: AppTheme.labelStyle),
        ),
        const SizedBox(height: 8),
        TextField(
          key: const Key('register_first_name_field'),
          controller: _firstNameController,
          style: AppTheme.defaultStyle,
          decoration: AppTheme.inputDecoration('Enter your first name'),
        ),
      ],
    );
  }

  Widget _buildLNameField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ValueListenableBuilder<bool>(
          valueListenable: ThemeService.isDarkMode,
          builder: (context, _, __) =>
              Text('👤 LAST NAME', style: AppTheme.labelStyle),
        ),
        const SizedBox(height: 8),
        TextField(
          key: const Key('register_last_name_field'),
          controller: _lastNameController,
          style: AppTheme.defaultStyle,
          decoration: AppTheme.inputDecoration('Enter your last name'),
        ),
      ],
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
          key: const Key('register_email_field'),
          controller: _emailController,
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
          key: const Key('register_password_field'),
          controller: _passwordController,
          style: AppTheme.defaultStyle,
          obscureText: true,
          decoration: AppTheme.inputDecoration('Create a strong password'),
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
          key: const Key('register_confirm_password_field'),
          controller: _confirmPasswordController,
          style: AppTheme.defaultStyle,
          obscureText: true,
          decoration: AppTheme.inputDecoration('Re-enter your password'),
        ),
      ],
    );
  }

  Widget _buildRegisterButton() {
    return GlowingContainer(
      child: ElevatedButton(
        key: const Key('register_submit_button'),
        onPressed: _isLoading ? null : _register,
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
            : const Text('✨ REGISTER', style: AppTheme.buttonTextStyle),
      ),
    );
  }

  Widget _buildLoginSection() {
    return Column(
      children: [
        Text(
          "Already have an account?",
          style: TextStyle(
            color: AppTheme.accentColor.withOpacity(0.5),
            fontSize: 16,
          ),
          textAlign: TextAlign.center,
        ),
        ElevatedButton(
          key: const Key('register_go_to_login_button'),
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => LoginPage(
                  apiClient: widget.apiClient,
                ),
              ),
            );
          },
          style: AppTheme.secondaryButtonStyle,
          child: const Text('🔑 Log In', style: AppTheme.buttonTextStyle),
        ),
      ],
    );
  }
}
