export default function Character(characterData, hp) {
    return (
        <div>
            <h1>{characterData.name}</h1>
            <h2>{hp} / {characterData.constitution * 10}</h2>
        </div>
    );
}