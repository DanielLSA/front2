import styles from "@/styles/Home.module.css";
import axios from "axios";
import { Rubik_Iso } from "next/font/google";
import Head from "next/head";
import { useEffect, useState } from "react";

const rubik = Rubik_Iso({ weight: "400", subsets: ["latin"] });

const apiUrl = "https://cenario22.onrender.com";
// const apiUrl = process.env.API_URL;

export default function Home() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [atualiza, setAtualiza] = useState(false);
  const [loading, setLoading] = useState(false);

  function changeInput(e) {
    setName(e.target.value);
  }

  function include() {
    if (name === "") return alert("Digite um nome!");
    setLoading(true);
    axios
      .post(`${apiUrl}/user`, { name: name })
      .then((response) => {
        console.log(response.data);
        alert("Usuário cadastrado com sucesso!");
        setAtualiza(!atualiza);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 422) {
          alert("Nome já cadastrado!");
          setLoading(false);
        }
        if (error.response.status === 500) {
          alert("Erro no servidor!");
          setLoading(false);
        }
      });
  }

  function find() {
    if (name === "") return alert("Digite um nome!");
    setLoading(true);
    axios
      .get(`${apiUrl}/user/${name}`)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("Usuário não encontrado!");
        setLoading(false);
      });
  }

  function findAll() {
    setLoading(true);
    axios
      .get(`${apiUrl}/users`)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function renderLoading() {
    return <div className={styles.loading}></div>;
  }

  useEffect(() => {
    findAll();
  }, [atualiza]);

  return (
    <>
      {loading ? renderLoading() : null}
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.top}>
          <p className={rubik.className}>Include-Find App</p>
        </div>
        <div className={styles.middle}>
          <div className={styles.containerOptions}>
            <form className={styles.form}>
              <input
                maxLength={20}
                className={styles.input}
                type="text"
                placeholder="Nome"
                name="name"
                onChange={changeInput}
              />
            </form>
            <div className={styles.containerButtons}>
              <div className={styles.optionInclude} onClick={include}>
                Cadastrar
              </div>
              <div className={styles.optionFindAll} onClick={findAll}>
                Buscar Todos
              </div>
              <div className={styles.optionFind} onClick={find}>
                Buscar
              </div>
            </div>
          </div>
          <div className={styles.containerItems}>
            <p className={styles.list}>Resultado:</p>
            {users.length > 0 ? (
              users.map((item, index) => (
                <div className={styles.item} key={index}>
                  {item.name}
                </div>
              ))
            ) : (
              <div>Não há usuários cadastrados!</div>
            )}
          </div>
        </div>
        <div className={styles.bottom}>
          <p className={rubik.className}>2023 &copy;</p>
        </div>
      </main>
    </>
  );
}
