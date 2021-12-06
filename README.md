<p align="center">

![Logo cartas radioativas](/imgs/icones/radioativo-preto.png)
# Cartas Radioativas

</p>

## Sobre o site
Inspirado no jogo Cards Against Humanity (CAH) e outros, que só mudam de nome, Cartas Radioativas é uma página que reúne cartas para que o usuário possa gerar seu próprio jogo, além de poder personalizar com as suas próprias cartas personalizadas.

## Sistema
O sistema é simples, criado com HTML, CSS, JS e PHP para interface com o banco de dados.
Utilizei os seguintes recurso/plugins de JS:
- Jquery: para facilitar e acelerar o desenvolvimento;
- SweetAlert: para facilitar a apresentação de mensagens;
- DayJS: para apresentar de forma mais simples o tempo das mensagens (Adm)
- JsPDF: para gerar os pdfs com as cartas

## Front End
O usuário pode escolher as categorias que criamos para ver as cartas da categoria e escolher as que interessam.
Além disso, o usuário pode inserir as cartas que ele quiser, personalizando o baralho dele.
Nesse momento o usuário pode criar o PDF com as cartas selecionadas e personalizadas ou ainda, personalizar o baralho, com o nome e a cor desejada.
Para ajudar na economia, o sistema disponibiliza dois tamanhos de cartas para o usuário escolher:

- Padrão (63mm/88mm) - 9 cartas por página e
- Menor (41mm/63mm) - 16 cartas por página

E pode ainda escolher o formato normal (frente e verso preenchidos de preto ou da cor escolhida pelo usuário) ou econômico, no qual só são criadas faixas pretas ou com a cor escolhida pelo usuário, economizando em tinta de impressão

Na hora de criar o PDF, caso o usuário tenha adicionado cartas personalizadas, ele pode optar por liberar essas cartas para que o sistema salve elas em um banco dados, podendo, futuramente, serem disponibilizadas em uma categoria.

No front end o usuário também pode enviar mensagem para os administradores do site.

## Back End

O back end é a parte do sistema que só os administradores possuem acesso.
No back end os administradores podem aprovar as cartas personalizadas, criar e editar as cartas, criar e editar categorias e ler as mensagens dos usuários.

## Considerações Finais
Cartas Radioativas é um mini projeto criado por mim para ajudar a mim, amigos e outras pessoas que queiram desfrutar desse tipo de jogo sem precisar gastar muito e podendo personalizar para o ambiente e para as pessoas que participarão do jogo.

Não tem o intuíto de substituir os jogos já existentes, nem mesmo ofender a ninguém.

Bom jogo!