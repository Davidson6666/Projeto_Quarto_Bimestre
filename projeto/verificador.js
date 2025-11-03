import readline from 'readline';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  password: 'lindo',
  host: 'localhost',
  port: 5432,
  database: 'teste_dE_depencia_funcional'
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function pegaTabelas() {
  const client = await pool.connect();
  const res = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public' AND table_type='BASE TABLE';
  `);
  client.release();
  const tabelas = [];
  for (let i = 0; i < res.rows.length; i++) {
    tabelas.push(res.rows[i].table_name);
  }
  return tabelas;
}

async function pegaColunas(tabela) {
  const client = await pool.connect();
  const res = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = '${tabela}';
  `);
  client.release();
  const colunas = [];
  for (let i = 0; i < res.rows.length; i++) {
    colunas.push(res.rows[i].column_name);
  }
  return colunas;
}

function combinacoes(arr, tamanho) {
  if (tamanho === 1) return arr.map(el => [el]);
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    const menores = combinacoes(arr.slice(i + 1), tamanho - 1);
    for (let j = 0; j < menores.length; j++) {
      res.push([arr[i], ...menores[j]]);
    }
  }
  return res;
}

function testaDependencia(client, tabela, determinante, dependente, callback) {
  const grupo = determinante.join(", ");
  const query = `
    SELECT ${grupo}
    FROM ${tabela}
    GROUP BY ${grupo}
    HAVING COUNT(DISTINCT ${dependente}) > 1;
  `;
  client.query(query, (err, result) => {
    if (err) {
      console.log("Erro no banco:", err);
      callback(false);
    } else {
      callback(result.rowCount === 0);
    }
  });
}

async function menu() {
  const tabelas = await pegaTabelas();
  const client = await pool.connect();

  function mostraMenu() {
    console.log("\nInsira o numero da tabela que deseja verificar, insira uma nova tabela ou saia:");
    for (let i = 0; i < tabelas.length; i++) {
      console.log(`${i + 1} - ${tabelas[i]}`);
    }

    let inserir = tabelas.length + 1
    let sair = tabelas.length + 2;
    console.log(`${inserir} - Inserir tabela no banco`);
    console.log(`${sair} - Sair`);

    rl.question("Escolha uma opção: ", async (opcao) => {
      const num = parseInt(opcao);

      if (num === sair) {
        console.log("Saindo...");
        rl.close();
        client.release();
        await pool.end();
        return;
      } else if (num === inserir) {
        console.log("Aqui você poderia implementar a lógica para inserir tabela no banco");
        mostraMenu();
        return;
      } else if (num >= 1 && num <= tabelas.length) {
        const negrito = '\x1b[1m';
        const reset = '\x1b[0m';
        const tabelaEscolhida = tabelas[num - 1];
        const colunas = await pegaColunas(tabelaEscolhida);
        console.log(`\nColunas da tabela ${tabelaEscolhida}: ${colunas.join(", ")}`);
        rl.question(`Você esta usando a tabela${negrito} ${tabelaEscolhida} ${reset} deseja verificar as depencias:` , async (legal) => {
          const opcao = legal;
          if (opcao.toLowerCase() === 'sim') {
            console.log("Iniciando verificação de dependências funcionais...");
            mostraMenu();
          }
          else if (opcao.toLowerCase() === 'não') {
            console.log("Operação cancelada pelo usuário.");
            mostraMenu();
          }
          else {
            console.log("Você não colocou o que deveria então não podera realizar a operação.Conecte-se ao banco novamente.");
            rl.close();
            client.release();
            await pool.end();
            return;
          }
        })
      } else {
        console.log("Opção inválida!");
        mostraMenu();
      }
    });
  }

  mostraMenu();
}

menu();
