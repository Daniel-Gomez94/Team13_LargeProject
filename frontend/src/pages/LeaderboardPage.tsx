import LoggedInName from '../components/LoggedInName';
import Leaderboard from '../components/Leaderboard';

const LeaderboardPage = () => {
    return (
        <div className="page-wrapper">
            <LoggedInName />
            <div className="page-content">
                <Leaderboard />
            </div>
        </div>
    );
}

export default LeaderboardPage;
