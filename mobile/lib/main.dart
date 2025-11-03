import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'theme/app_theme.dart';
import 'pages/login_page.dart';
import 'pages/register_page.dart';
import 'widgets/glow.dart';
import 'widgets/gradient.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Codele',
      theme: AppTheme.theme,
      home: const LoginPage(),
    );
  }
}

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
        Uri.parse("http://159.65.36.255/api/auth/login"),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': _loginController.text,
          'password': _passwordController.text,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['error'] == null || data['error'].isEmpty) {
          //login worked
        } else {
          setState(() {
            _errorMessage = data['error'];
          });
        }
      } else {
        setState(() {
          _errorMessage = 'Login failed. Please try again.';
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
          child: const GradientText(text: 'CODELE', style: AppTheme.titleStyle),
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
            const GradientText(
              text: 'Welcome Back, Knight!',
              style: AppTheme.headingStyle,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            _buildEmailField(),
            const SizedBox(height: 24),
            _buildPasswordField(),
            const SizedBox(height: 24),
            _buildLoginButton(),
            const SizedBox(height: 18),
            if (_errorMessage.isNotEmpty)
              Text(
                _errorMessage,
                style: const TextStyle(color: Colors.red, fontSize: 14),
                textAlign: TextAlign.center,
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
      child: const Text(
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
          decoration: AppTheme.inputDecoration('Enter your password'),
        ),
      ],
    );
  }

  Widget _buildLoginButton() {
    return GlowingContainer(
      child: ElevatedButton(
        onPressed: _isLoading ? null : _login,
        style: AppTheme.primaryButtonStyle,
        child: const Text('⚔️ LOGIN', style: AppTheme.buttonTextStyle),
      ),
    );
  }

  Widget _buildRegisterSection() {
    return Column(
      children: [
        Text(
          "Don't have an account?",
          style: TextStyle(
            color: AppTheme.primaryGold.withOpacity(0.5),
            fontSize: 16,
          ),
          textAlign: TextAlign.center,
        ),
        ElevatedButton(
          onPressed: () {},
          style: AppTheme.secondaryButtonStyle,
          child: const Text('✨ Register Now', style: AppTheme.buttonTextStyle),
        ),
      ],
    );
  }
}

//theme

class AppTheme {
  static const Color primaryGold = Color(0xFFFFC904);
  static const Color darkGold = Color(0xFFb58500);
  static const Color darkBackground = Color(0xFF1a1a1a);
  static const Color darkerBackground = Color(0xFF2a2a2a);
  static const Color black = Colors.black;

  static const TextStyle titleStyle = TextStyle(
    fontSize: 36,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  );
  static const TextStyle headingStyle = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  );
  static const TextStyle labelStyle = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: primaryGold,
  );
  static const TextStyle defaultStyle = TextStyle(
    fontSize: 16,
    color: primaryGold,
  );
  static const TextStyle buttonTextStyle = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.bold,
  );

  static InputDecoration inputDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: TextStyle(color: primaryGold.withOpacity(0.5)),
      enabledBorder: OutlineInputBorder(
        borderSide: const BorderSide(color: primaryGold, width: 2),
        borderRadius: BorderRadius.circular(8),
      ),
      focusedBorder: OutlineInputBorder(
        borderSide: const BorderSide(color: darkGold, width: 4),
        borderRadius: BorderRadius.circular(8),
      ),
      fillColor: darkerBackground,
      filled: true,
    );
  }

  static ButtonStyle primaryButtonStyle = ElevatedButton.styleFrom(
    backgroundColor: primaryGold,
    foregroundColor: black,
    padding: const EdgeInsets.symmetric(vertical: 16),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
      side: const BorderSide(color: darkGold, width: 2),
    ),
  );
  static ButtonStyle secondaryButtonStyle = ElevatedButton.styleFrom(
    backgroundColor: Colors.transparent,
    foregroundColor: primaryGold,
  );

  static Shader goldGradientShader(Rect bounds) {
    return const LinearGradient(
      colors: [primaryGold, darkGold],
    ).createShader(bounds);
  }

  static List<BoxShadow> goldGlowShadow({double opacity = 0.5}) {
    return [
      BoxShadow(
        color: primaryGold.withOpacity(opacity),
        blurRadius: 15,
        spreadRadius: 3,
      ),
    ];
  }

  static BoxDecoration cardDecoration = BoxDecoration(
    borderRadius: BorderRadius.circular(16),
    color: darkBackground,
    border: Border.all(color: primaryGold, width: 2),
  );

  static ThemeData get theme {
    return ThemeData(
      primaryColor: primaryGold,
      scaffoldBackgroundColor: black,
      useMaterial3: true,
      appBarTheme: const AppBarTheme(
        backgroundColor: black,
        centerTitle: true,
        toolbarHeight: 80,
      ),
    );
  }
}

//

class GradientText extends StatelessWidget {
  final String text;
  final TextStyle style;
  final TextAlign? textAlign;

  const GradientText({
    super.key,
    required this.text,
    required this.style,
    this.textAlign,
  });

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      shaderCallback: (bounds) => AppTheme.goldGradientShader(bounds),
      child: Text(text, style: style, textAlign: textAlign),
    );
  }
}

//

class GlowingContainer extends StatelessWidget {
  final Widget child;
  final double opacity;

  const GlowingContainer({super.key, required this.child, this.opacity = 0.5});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        boxShadow: AppTheme.goldGlowShadow(opacity: opacity),
      ),
      child: child,
    );
  }
}
