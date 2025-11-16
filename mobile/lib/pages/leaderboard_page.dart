import 'package:flutter/material.dart';
import 'dart:convert';
import '../theme/app_theme.dart';
import '../widgets/gradient.dart';
import '../services/theme_service.dart';
import 'login_page.dart';
import '../services/api_service.dart';

class LeaderboardPage extends StatefulWidget {
  final int userId;
  final String userName;

  LeaderboardPage({
    super.key,
    required this.userId,
    required this.userName,
    ApiClient? apiClient,
  }) : apiClient = apiClient ?? ApiService();

  final ApiClient apiClient;

  @override
  State<LeaderboardPage> createState() => _LeaderboardPageState();
}

class _LeaderboardPageState extends State<LeaderboardPage> {
  List<dynamic> _leaderboardData = [];
  bool _isLoading = true;
  String _errorMessage = '';
  String _selectedTab = 'score'; // 'score' or 'streak'

  @override
  void initState() {
    super.initState();
    _loadLeaderboard();
  }

  Future<void> _loadLeaderboard() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final endpoint = _selectedTab == 'score'
          ? '/api/leaderboard/score'
          : '/api/leaderboard/streak';

      final response = await widget.apiClient.get(endpoint);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _leaderboardData = data['leaderboard'] ?? [];
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = 'Failed to load leaderboard';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Network error. Please check your connection.';
        _isLoading = false;
      });
      print('Leaderboard error: $e');
    }
  }

  void _switchTab(String tab) {
    if (tab != _selectedTab) {
      setState(() {
        _selectedTab = tab;
      });
      _loadLeaderboard();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _buildAppBar(),
      endDrawer: _buildDrawer(context),
      body: RefreshIndicator(
        onRefresh: _loadLeaderboard,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _buildUserGreeting(),
                SizedBox(height: 24),
                _buildTabSelector(),
                const SizedBox(height: 24),
                _buildLeaderboardCard(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      title: Align(
        alignment: Alignment.centerLeft,
        child: Padding(
          padding: const EdgeInsets.only(top: 16),
          child: Container(
            decoration: BoxDecoration(
              boxShadow: AppTheme.goldGlowShadow(opacity: 0.3),
            ),
            child: GradientText(
              text: 'CODELE LEADERBOARD',
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ),
      actions: [
        Builder(
          builder: (context) => IconButton(
            icon: const Icon(Icons.menu, size: 28, color: AppTheme.primaryGold),
            onPressed: () => Scaffold.of(context).openEndDrawer(),
          ),
        ),
      ],
    );
  }

  Widget _buildDrawer(BuildContext context) {
    return Drawer(
      backgroundColor: AppTheme.darkerBackground,
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              decoration: BoxDecoration(color: AppTheme.darkerBackground),
              height: 72,
              alignment: Alignment.center,
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: const GradientText(
                text: 'Menu',
                style: AppTheme.headingStyle,
              ),
            ),
            const Divider(color: AppTheme.primaryGold, thickness: 2),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12.0),
              child: Column(
                children: [
                  ValueListenableBuilder<bool>(
                    valueListenable: ThemeService.isDarkMode,
                    builder: (context, isDark, _) {
                      return ListTile(
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 8.0,
                        ),
                        leading: Icon(
                          Icons.brightness_6,
                          color: AppTheme.accentColor,
                        ),
                        title: Text(
                          'Dark Mode',
                          style: TextStyle(color: AppTheme.accentColor),
                        ),
                        trailing: Switch(
                          value: isDark,
                          onChanged: (v) => ThemeService.toggle(),
                          activeColor: AppTheme.primaryGold,
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 8),
                  ListTile(
                    visualDensity: VisualDensity.compact,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 8.0),
                    leading: Icon(Icons.logout, color: AppTheme.accentColor),
                    title: Text(
                      'Logout',
                      style: TextStyle(color: AppTheme.accentColor),
                    ),
                    onTap: () {
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(
                          builder: (context) => LoginPage(
                            apiClient: widget.apiClient,
                          ),
                        ),
                        (route) => false,
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUserGreeting() {
    return Container(
      decoration: AppTheme.cardDecoration,
      padding: const EdgeInsets.all(16.0),
      child: Row(
        children: [
          const Text('⚔️', style: TextStyle(fontSize: 32)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Welcome, ${widget.userName}!',
                  style: TextStyle(
                    color: AppTheme.accentColor,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabSelector() {
    return Row(
      children: [
        Expanded(
          child: GestureDetector(
            onTap: () => _switchTab('score'),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                color: _selectedTab == 'score'
                    ? AppTheme.primaryGold
                    : AppTheme.darkBackground,
                border: Border.all(color: AppTheme.primaryGold, width: 2),
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(8),
                  bottomLeft: Radius.circular(8),
                ),
              ),
              child: Text(
                '🏆 Top Scores',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: _selectedTab == 'score'
                      ? AppTheme.black
                      : AppTheme.accentColor,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ),
        Expanded(
          child: GestureDetector(
            onTap: () => _switchTab('streak'),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                color: _selectedTab == 'streak'
                    ? AppTheme.primaryGold
                    : AppTheme.darkBackground,
                border: Border.all(color: AppTheme.primaryGold, width: 2),
                borderRadius: const BorderRadius.only(
                  topRight: Radius.circular(8),
                  bottomRight: Radius.circular(8),
                ),
              ),
              child: Text(
                '🔥 Top Streaks',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: _selectedTab == 'streak'
                      ? AppTheme.black
                      : AppTheme.accentColor,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLeaderboardCard() {
    return Container(
      decoration: AppTheme.cardDecoration,
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          GradientText(
            text: _selectedTab == 'score'
                ? '🏆 Top Players by Score'
                : '🔥 Top Players by Streak',
            style: AppTheme.headingStyle.copyWith(fontSize: 24),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          if (_isLoading)
            Center(
              child: CircularProgressIndicator(color: AppTheme.accentColor),
            )
          else if (_errorMessage.isNotEmpty)
            Center(
              child: Column(
                children: [
                  Text(
                    _errorMessage,
                    style: const TextStyle(color: Colors.red, fontSize: 16),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _loadLeaderboard,
                    style: AppTheme.primaryButtonStyle,
                    child: const Text('Retry', style: AppTheme.buttonTextStyle),
                  ),
                ],
              ),
            )
          else if (_leaderboardData.isEmpty)
            Center(
              child: Text(
                'No leaderboard data available yet.\nBe the first to complete a challenge!',
                style: TextStyle(color: AppTheme.accentColor, fontSize: 16),
                textAlign: TextAlign.center,
              ),
            )
          else
            _buildLeaderboardList(),
        ],
      ),
    );
  }

  Widget _buildLeaderboardList() {
    return Column(
      children: List.generate(
        _leaderboardData.length,
        (index) => _buildLeaderboardItem(index),
      ),
    );
  }

  Widget _buildLeaderboardItem(int index) {
    final item = _leaderboardData[index];
    final rank = index + 1;
    final isCurrentUser = item['userId'] == widget.userId;

    String rankEmoji;
    if (rank == 1) {
      rankEmoji = '🥇';
    } else if (rank == 2) {
      rankEmoji = '🥈';
    } else if (rank == 3) {
      rankEmoji = '🥉';
    } else {
      rankEmoji = '$rank.';
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isCurrentUser
            ? AppTheme.primaryGold.withOpacity(0.2)
            : AppTheme.darkerBackground,
        border: Border.all(
          color: isCurrentUser ? AppTheme.primaryGold : AppTheme.darkGold,
          width: isCurrentUser ? 3 : 1,
        ),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 40,
            child: Text(
              rankEmoji,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${item['firstName']} ${item['lastName']}${isCurrentUser ? ' (You)' : ''}',
                  style: TextStyle(
                    color: AppTheme.accentColor,
                    fontSize: 16,
                    fontWeight: isCurrentUser
                        ? FontWeight.bold
                        : FontWeight.normal,
                  ),
                ),
                if (_selectedTab == 'score')
                  Text(
                    '${item['totalCompletions']} challenges completed',
                    style: TextStyle(
                      color: AppTheme.accentColor.withOpacity(0.7),
                      fontSize: 12,
                    ),
                  ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: AppTheme.primaryGold,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              _selectedTab == 'score'
                  ? '${item['totalScore']}'
                  : '${item['longestStreak']} day${item['longestStreak'] != 1 ? 's' : ''}',
              style: const TextStyle(
                color: AppTheme.black,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
