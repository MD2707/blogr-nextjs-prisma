// Importez les modules nécessaires de React
import React from 'react';

// Définissez le composant Ranking
const Ranking = ({ userPostCounts }) => {
    return (
        <div>
            <h2>Classement des Utilisateurs</h2>
            <ul>
                {userPostCounts.map((user) => (
                    <li key={user.userId}>
                        {user.userName}: {user.numberOfPublishedPosts} post(s)
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Exportez le composant pour l'utiliser ailleurs
export default Ranking;