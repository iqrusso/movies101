# Movies 101
Movies 101 è un'applicazione a singola pagina realizzata con *Vue.js* e *Vuetify*. I contenuti sono forniti dall'API di [The Movie Database](https://www.themoviedb.org/) (TMDb). Una demo è disponibile al link [movies101.tk](https://movies101.tk/).

## 1. Viste
L'app alterna due viste:

- L'elenco di film *(List.vue)*;
- La pagina di dettaglio di un singolo film *(Detail.vue)*.

I contenuti di queste viste variano in base alle proprietà passate nel routing. Ad esempio, le pagine */popular* e */top-rated* utilizzeranno lo stesso componente (*List.vue*), ma faranno una chiamata API diversa perché le rispettive proprietà `listToGet` sono diverse.  
Quindi, considerato il seguente endpoint:  
`https://api.themoviedb.org/3/movie/${this.listToGet}`  
al posto di `${this.listToGet}` potremo avere *popular*, *top_rated*, *upcoming*, *latest*, ecc.

## 2. Componenti
L'app fa un uso massiccio di card:

- **MovieCard**: è la card presente negli elenchi, che può essere verticale o orizzontale;
- **DetailMovieCard**: è la card presente nelle pagine di dettaglio.  

Per favorirne il riutilizzo le card sono state scomposte in sotto-componenti:

- **MovieCardImage**;
- **MovieCardTop**;
- **MovieCardBottom**.

In base alla pagina in cui si trovano, questi sotto-componenti cambiano stile e contenuto.

## 3. Interazione

### 3.1 Aggiungere il film a una collezione
L'utente può aggiungere i film a tre collezioni personali:

- Preferiti
- Cronologia
- Watchlist

Le pagine di queste tre collezioni sono sempre realizzate con il componente *List.vue*, ma hanno una proprietà `mode: "firebase"` che specifica che le liste di film non vanno ottenute tramite una chiamata API, ma attraverso Firebase. Nel database infatti sono archiviati gli ID dei film contenuti in queste collezioni: una volta ottenuti questi ID, per ognuno di loro può essere fatta una richiesta a TMDb.

In base alla presenza/assenza di un film in una collezione, i pulsanti cambieranno icona, colore e *tooltip*.

### 3.2 Valutare il film
Dalla pagina di dettaglio, l'utente può valutare il film da 1 a 5 stelle. Se l'utente non ha ancora espresso il voto per un film, allora sarà visualizzata la valutazione media degli altri utenti (colorata in grigio). Se invece l'utente ha espresso un proprio giudizio, verrà visualizzata la sua valutazione (colorata in rosso). Questa funzione è possibile grazie ai costrutti `get()` e `set()` all'interno di una proprietà *computed* in *MovieCardBottom.vue*.
