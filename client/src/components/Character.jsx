export default function Character({characterData, hp}) {
    return (
        <div>
            <h1>{characterData[0].name}</h1>
            <h2>{hp} / {characterData[0].constitution * 10}</h2>
        </div>
    );
}