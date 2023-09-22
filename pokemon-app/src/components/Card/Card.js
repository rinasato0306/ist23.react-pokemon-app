import "./Card.css";
import React, { useState, useEffect } from 'react';
import { getPokemonAbility, getPokemonName, getPokemonType } from '../../utils/pokemon';

const Card = ({ pokemon }) => {

 const [pokemonTypeURL, setPokemonTypeURL] = useState([]);
 const [pokemonName, setPokemonName] = useState([]);
 const [pokemonAbility, setPokemonAbility] = useState([]);

// ポケモンのタイプを日本語として出力する関数　↓
 let resPokemonTypes = pokemon.types.map((v) => {
   let typesURL = v.type.url;
   return typesURL;
 });

 const loadPokemonType = async (data) => {
   let _pokemonType = await Promise.all(
     data.map(async (pokemon) => {
       let pokemonTypeDetail = await getPokemonType(pokemon);
       let jaName = pokemonTypeDetail.names.find(name => name.language.name === "ja").name;
       return jaName;
     })
   );
   let joinedTypes = _pokemonType.join(" / ");
   setPokemonTypeURL(joinedTypes);
 };

// ポケモンのタイプを日本語として出力する関数　↓
let resPokemonAbility = pokemon.abilities.map((v) => {
 let AbilityURL = v.ability.url;
 return AbilityURL;
});

const loadPokemonAbility = async (data) => {
 let _pokemonAbility = await Promise.all(
   data.map(async (pokemon) => {
     let pokemonAbilityDetail = await getPokemonAbility(pokemon);
     let jaName = pokemonAbilityDetail.names.find(name => name.language.name === "ja").name;
     return jaName;
   })
 );
 let joinedAbilitys = _pokemonAbility.join(" / ");
 setPokemonAbility(joinedAbilitys);
};

// ポケモンの名前を日本語として出力する関数　↓
let pokemonNameDetail = pokemon.species.url;

const loadPokemonName = async (data) => {
 let response = await fetch(data);
 let result = await response.json();
 let jaName = result.names.find(name => name.language.name === "ja").name;
 setPokemonName(jaName);
};

 useEffect(() => {
   loadPokemonType(resPokemonTypes);
   loadPokemonName(pokemonNameDetail);
   loadPokemonAbility(resPokemonAbility);
 },[])

 console.log(pokemon);


 return (
    <div className="card">
      <div className="cardImg">
        <img src={pokemon.sprites.other['official-artwork'].front_default} alt="" />
      </div>
      <h3 className="cardNames">{pokemonName}</h3>
      <div className="cardTypes">
        <span>タイプ：</span>{pokemonTypeURL}</div>
      <div className="cardInfo">
        <div className="cardData">
          <p>重さ：{pokemon.weight / 10} kg</p>
        </div>
        <div className="cardData">
          <p>高さ：{pokemon.height / 10} m</p>
        </div>
        <div className="cardData cardAbility">
          <p>能力：{pokemonAbility}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;