import "./Card.css";
import React, { useState, useEffect } from "react";
import {
  getPokemonAbility,
  getPokemonName,
  getPokemonType,
} from "../../utils/pokemon";

const Card = ({ pokemon }) => {
  const [pokemonTypeURL, setPokemonTypeURL] = useState([]);
  const [pokemonName, setPokemonName] = useState([]);
  const [pokemonAbility, setPokemonAbility] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // ポケモンのタイプを日本語として出力する関数　↓
  let resPokemonTypes = pokemon.types.map((v) => {
    let typesURL = v.type.url;
    return typesURL;
  });

  const loadPokemonType = async (data) => {
    let _pokemonType = await Promise.all(
      data.map(async (pokemon) => {
        let pokemonTypeDetail = await getPokemonType(pokemon);
        let jaName = pokemonTypeDetail.names.find(
          (name) => name.language.name === "ja"
        ).name;
        return jaName;
      })
    );
    let joinedTypes = _pokemonType.join(" / ");
    setPokemonTypeURL(joinedTypes);
  };

  // ポケモンの能力を日本語として出力する関数　↓
  let resPokemonAbility = pokemon.abilities.map((v) => {
    let AbilityURL = v.ability.url;
    return AbilityURL;
  });

  const loadPokemonAbility = async (data) => {
    try {
      let _pokemonAbility = await Promise.all(
        data.map(async (pokemon) => {
          let pokemonAbilityDetail = await getPokemonAbility(pokemon);
          if (pokemonAbilityDetail) {
            let jaName = pokemonAbilityDetail.names.find(
              (name) => name.language.name === "ja"
            ).name;
            return jaName;
          } else {
            return "？？？"; // 能力情報が存在しない場合、デフォルト値を返す
          }
        })
      );
      let joinedAbilitys = _pokemonAbility.join(" / ");
      setPokemonAbility(joinedAbilitys);
    } catch (error) {
      console.error("ポケモンの能力情報を取得できませんでした:", error);
      setPokemonAbility("？？？"); // エラーが発生した場合もデフォルト値を表示
    }
  };

  // ポケモンの名前を日本語として出力する関数　↓
  let pokemonNameDetail = pokemon.species.url;

  const loadPokemonName = async (data) => {
    try {
      let response = await fetch(data);
      let result = await response.json();
      if (result.names) {
        let jaName = result.names.find((name) => name.language.name === "ja");
        if (jaName) {
          setPokemonName(jaName.name);
        } else {
          setPokemonName("？？？"); // 日本語の名前情報が存在しない場合、デフォルト値を表示
          console.error("ポケモンの名前情報を取得できませんでした:");
        }
      } else {
        setPokemonName("？？？"); // 名前情報が存在しない場合、デフォルト値を表示
        console.error("ポケモンの名前情報を取得できませんでした:");
      }
    } catch (error) {
      console.error("ポケモンの名前情報を取得できませんでした:", error);
      setPokemonName("？？？"); // エラーが発生した場合もデフォルト値を表示
    }
  };

  useEffect(() => {
    loadPokemonType(resPokemonTypes);
    loadPokemonName(pokemonNameDetail);
    loadPokemonAbility(resPokemonAbility);
  }, []);

  console.log(pokemon);

  //画像情報が存在しない場合のためのデフォルト値を定義　↓
  const defaultImageUrl =
    "https://www.pokemoncenter-online.com/static/product_image/4511546095659/4511546095659_01.jpg";

  return (
    <div>
      <div onClick={openModal} className="card">
        <div className="cardImg">
          {pokemon.sprites.other["official-artwork"].front_default ? (
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt=""
            />
          ) : (
            <img src={defaultImageUrl} alt="デフォルト画像" />
          )}
        </div>
        <h3 className="cardNames">{pokemonName}</h3>
      </div>
      <div className={`modal ${isOpen ? "visible" : ""}`} onClick={closeModal}>
        <div className="modal-inner">
          <div className="modal-header"></div>
          <div className="modal-introduction">
            <div className="modalImg">
              {pokemon.sprites.other["official-artwork"].front_default ? (
                <img
                  src={pokemon.sprites.other["official-artwork"].front_default}
                  alt=""
                />
              ) : (
                <img src={defaultImageUrl} alt="デフォルト画像" /> //画像情報が存在しない場合はデフォルト画像を表示
              )}
            </div>
            <h3 className="modalNames">{pokemonName}</h3>
            <div className="modalTypes">
              <span>タイプ：</span>
              {pokemonTypeURL}
            </div>
            <div className="modalInfo">
              <div className="modalData">
                <p>重さ：{pokemon.weight / 10} kg</p>
              </div>
              <div className="modalData">
                <p>高さ：{pokemon.height / 10} m</p>
              </div>
              <div className="modalData">
                <p>能力：{pokemonAbility}</p>
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={closeModal}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
