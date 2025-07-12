# Especificações dos Serviços - JP Studio

## Serviços Disponíveis

### 1. Corte
- **Valor:** €15
- **Duração:** 30 minutos
- **Descrição:** Corte de cabelo clássico e atual

### 2. Barba
- **Valor:** €10
- **Duração:** 30 minutos
- **Descrição:** Aparar e modelar barba

### 3. Corte + Barba
- **Valor:** €20
- **Duração:** 1 hora (60 minutos)
- **Descrição:** Serviço completo de corte e barba

## Regras de Duração

- **Serviços individuais:** 30 minutos cada
- **Serviços combinados:** 1 hora total
- **Desconto combinado:** €5 de economia (€15 + €10 = €25, mas cobra €20)

## Implementação no Sistema

### Campo de Seleção
Formato: "Nome do Serviço - €Valor (Duração)"

Exemplos:
- "Corte - €15 (30min)"
- "Barba - €10 (30min)" 
- "Corte + Barba - €20 (1h)"

### Dados Estruturados
```javascript
const servicos = {
  corte: {
    nome: "Corte",
    valor: 15,
    duracao: 30,
    descricao: "Corte de cabelo clássico e atual"
  },
  barba: {
    nome: "Barba", 
    valor: 10,
    duracao: 30,
    descricao: "Aparar e modelar barba"
  },
  corte_barba: {
    nome: "Corte + Barba",
    valor: 20,
    duracao: 60,
    descricao: "Serviço completo de corte e barba"
  }
};
```

