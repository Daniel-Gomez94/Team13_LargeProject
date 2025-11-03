import LoggedInName from '../components/LoggedInName';
import CodingGame from '../components/CodingGame';

const GamePage = () => {
    return (
        <div className="page-wrapper">
            <LoggedInName />
            <div className="page-content">
                <CodingGame />
            </div>
        </div>
    );
}

export default GamePage;