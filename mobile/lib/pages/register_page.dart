import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/gradient.dart';
import '../widgets/glow.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;

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
          child: const GradientText(text: 'CODELE', style: AppTheme.titleStyle),
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
            const GradientText(
              text: 'Welcome Back, Knight!',
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
      child: const Text(
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
        const Text('👤 FIRST NAME', style: AppTheme.labelStyle),
        const SizedBox(height: 8),
        TextField(
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
        const Text('👤 LAST NAME', style: AppTheme.labelStyle),
        const SizedBox(height: 8),
        TextField(
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
        const Text('📧 EMAIL ADDRESS', style: AppTheme.labelStyle),
        const SizedBox(height: 8),
        TextField(
          style: AppTheme.defaultStyle,
          decoration: AppTheme.inputDecoration('knight.ucf.edu'),
        ),
      ],
    );
  }

  Widget _buildPasswordField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('🔒 PASSWORD', style: AppTheme.labelStyle),
        const SizedBox(height: 8),
        TextField(
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
        const Text('🔒 CONFIRM PASSWORD', style: AppTheme.labelStyle),
        const SizedBox(height: 8),
        TextField(
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
        onPressed: () {},
        style: AppTheme.primaryButtonStyle,
        child: const Text('✨ REGISTER', style: AppTheme.buttonTextStyle),
      ),
    );
  }

  Widget _buildLoginSection() {
    return Column(
      children: [
        Text(
          "Already have an account?",
          style: TextStyle(
            color: AppTheme.primaryGold.withOpacity(0.5),
            fontSize: 16,
          ),
          textAlign: TextAlign.center,
        ),
        ElevatedButton(
          onPressed: () {},
          style: AppTheme.secondaryButtonStyle,
          child: const Text('🔑 Log In', style: AppTheme.buttonTextStyle),
        ),
      ],
    );
  }
}
