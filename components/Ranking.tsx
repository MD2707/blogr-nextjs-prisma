// Importez les modules nécessaires de React
import React from 'react';

// Définissez le composant Ranking
const Ranking = ({ userPostCounts }) => {
    return (
        <div>
            <h2>Classement des Utilisateurs</h2>
            
            <ul role="list" className="divide-y divide-gray-100">
                {userPostCounts.map((user) => (
                    <li key={user.userId} className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" alt="" />
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">{user.userName}</p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{user.numberOfPublishedPosts}  post(s)</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Exportez le composant pour l'utiliser ailleurs
export default Ranking;