// Estrutura de dados dos serviços
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

// Função para obter informações do serviço
function obterInfoServico(tipoServico) {
  return servicos[tipoServico] || null;
}

// Função para obter agendamentos salvos no localStorage
function obterAgendamentos() {
  const agendamentos = localStorage.getItem('agendamentos');
  return agendamentos ? JSON.parse(agendamentos) : [];
}

// Função para salvar agendamento no localStorage
function salvarAgendamento(data, hora, tipoServico) {
  const agendamentos = obterAgendamentos();
  const infoServico = obterInfoServico(tipoServico);
  const novoAgendamento = { 
    data, 
    hora, 
    servico: tipoServico,
    infoServico: infoServico,
    timestamp: new Date().toISOString() 
  };
  agendamentos.push(novoAgendamento);
  localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

// Função para verificar se um horário já está agendado
function horarioJaAgendado(data, hora) {
  const agendamentos = obterAgendamentos();
  return agendamentos.some(agendamento => 
    agendamento.data === data && agendamento.hora === hora
  );
}

// Função para verificar se um horário já passou
function horarioJaPassou(data, hora) {
  const agora = new Date();
  const dataHorario = new Date(`${data}T${hora}:00`);
  return dataHorario <= agora;
}

document.getElementById("form-agendamento").addEventListener("submit", function (e) {
  e.preventDefault();

  const dataSelecionada = new Date(this.data.value);
  const diaSemana = dataSelecionada.getDay(); // 0 = Domingo

  if (diaSemana === 0) {
    alert("Agendamentos não são permitidos aos domingos.");
    return;
  }

  // Verificar se o horário já está agendado
  if (horarioJaAgendado(this.data.value, this.hora.value)) {
    alert("Este horário já está agendado. Por favor, escolha outro horário.");
    return;
  }

  // Verificar se o horário já passou
  if (horarioJaPassou(this.data.value, this.hora.value)) {
    alert("Este horário já passou. Por favor, escolha um horário futuro.");
    return;
  }

  const templateParams = {
    nome: this.nome.value,
    telefone: this.telefone.value,
    data: this.data.value,
    hora: this.hora.value,
    servico: this.servico.value,
  };

  emailjs.send("service_at6ffvw", "template_w4es10q", templateParams)
    .then(function(response) {
      // Salvar agendamento após envio bem-sucedido
      salvarAgendamento(templateParams.data, templateParams.hora, templateParams.servico);
      alert("Agendamento enviado com sucesso!");
      e.target.reset();
      atualizarHorarios(); // Recarrega horários válidos
    }, function(error) {
      alert("Erro ao enviar agendamento. Verifique os dados.");
      console.error(error);
    });
});

// Bloquear domingos ao escolher a data e atualizar horários válidos
document.getElementById("data").addEventListener("input", function () {
  const dataSelecionada = new Date(this.value);
  if (dataSelecionada.getDay() === 0) {
    alert("Domingos estão indisponíveis para agendamento.");
    this.value = "";
    atualizarHorarios(); // Limpa horários
    return;
  }
  atualizarHorarios();
});

// Atualiza os horários disponíveis com base no dia da semana, horários passados e agendados
function atualizarHorarios() {
  const dataInput = document.getElementById("data").value;
  const selectHora = document.getElementById("hora");

  // Limpa opções
  selectHora.innerHTML = '<option value="">Escolha um horário</option>';

  if (!dataInput) return;

  const dataSelecionada = new Date(dataInput);
  const diaSemana = dataSelecionada.getDay();

  // Segunda a sexta: 09:00 às 17:00 (exceto 12:00, 13:00)
  const horariosSemana = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  // Sábado: 09:00 às 14:00 (sem pausa)
  const horariosSabado = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

  const horariosValidos = (diaSemana === 6) ? horariosSabado : horariosSemana;

  // Filtrar horários que já passaram e que já estão agendados
  const horariosDisponiveis = horariosValidos.filter(horario => {
    // Verificar se o horário já passou
    if (horarioJaPassou(dataInput, horario)) {
      return false;
    }
    
    // Verificar se o horário já está agendado
    if (horarioJaAgendado(dataInput, horario)) {
      return false;
    }
    
    return true;
  });

  // Adicionar horários disponíveis ao select
  horariosDisponiveis.forEach(horario => {
    const option = document.createElement("option");
    option.value = horario;
    option.textContent = horario;
    selectHora.appendChild(option);
  });

  // Mostrar mensagem se não há horários disponíveis
  if (horariosDisponiveis.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Nenhum horário disponível";
    option.disabled = true;
    selectHora.appendChild(option);
  }
}

// Atualizar horários quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
  // Definir data mínima como hoje
  const hoje = new Date();
  const dataMinima = hoje.toISOString().split('T')[0];
  document.getElementById("data").setAttribute('min', dataMinima);
  
  // Atualizar horários se já há uma data selecionada
  const dataInput = document.getElementById("data");
  if (dataInput.value) {
    atualizarHorarios();
  }
  
  // Adicionar listener para mudança de serviço
  const servicoSelect = document.querySelector('select[name="servico"]');
  if (servicoSelect) {
    servicoSelect.addEventListener('change', function() {
      exibirResumoServico(this.value);
    });
  }
});

// Função para exibir resumo do serviço selecionado
function exibirResumoServico(tipoServico) {
  // Remove resumo anterior se existir
  const resumoAnterior = document.getElementById('resumo-servico');
  if (resumoAnterior) {
    resumoAnterior.remove();
  }
  
  if (!tipoServico) return;
  
  const infoServico = obterInfoServico(tipoServico);
  if (!infoServico) return;
  
  // Criar elemento de resumo
  const resumoDiv = document.createElement('div');
  resumoDiv.id = 'resumo-servico';
  resumoDiv.style.cssText = `
    background:rgb(0, 0, 0);
    padding: 10px;
    margin: 10px 0;
    border-radius: 10px;
    border-left: 4px solid rgb(0, 0, 0);
    font-size: 20px;
  `;
  
  resumoDiv.innerHTML = `
    <strong>Serviço Selecionado:</strong><br>
    📋 ${infoServico.nome}<br>
    💰 Valor: €${infoServico.valor}<br>
    ⏱️ Duração: ${infoServico.duracao} minutos<br>
    📝 ${infoServico.descricao}
  `;
  
  // Inserir após o select de serviços
  const servicoSelect = document.querySelector('select[name="servico"]');
  servicoSelect.parentNode.insertBefore(resumoDiv, servicoSelect.nextSibling);
}

