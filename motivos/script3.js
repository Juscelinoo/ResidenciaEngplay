document.addEventListener("DOMContentLoaded", () => {
  // Lê os motivos selecionados da página anterior
  let selectedReasons = [];
  try {
    const saved = localStorage.getItem('motivoCancelamento');
    if (saved) {
      selectedReasons = JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Erro ao ler motivoCancelamento:', err);
  }

  // Cria o botão de notificação
  const notifyButton = document.createElement('button');
  notifyButton.className = 'notification-button';
  notifyButton.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      <path d="M12 7v2m0 3v7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    Mostrar detalhes
  `;
  document.body.appendChild(notifyButton);

  // Elementos de "Manter assinatura"
  const manterButtons = document.querySelectorAll('.aceitar, .aceitar-2, .aceitar-3');

  // Cria o container de notificações se não existir
  let notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.style.cssText = `
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      pointer-events: none;
    `;
    document.body.appendChild(notificationContainer);
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      background: linear-gradient(135deg, #0e4194 0%, #1a56b3 100%);
      color: white;
      padding: 16px 28px;
      border-radius: 12px;
      font-family: "SF Pro Rounded-Medium", Helvetica;
      font-size: 16px;
      box-shadow: 0 8px 24px rgba(14, 65, 148, 0.25),
                  0 2px 6px rgba(14, 65, 148, 0.12);
      opacity: 0;
      transform: translateY(-20px);
      transition: all 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
      margin: 0 16px;
      max-width: 380px;
      text-align: center;
      display: flex;
      align-items: center;
      gap: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      pointer-events: auto;
    `;

    // Ícone de sucesso
    const icon = document.createElement('div');
    icon.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
        <path d="M8 12.5L10.5 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    notification.appendChild(icon);

    // Container do texto
    const textContainer = document.createElement('div');
    textContainer.style.flex = '1';

    // Título
    const title = document.createElement('div');
    title.textContent = 'Assinatura Mantida!';
    title.style.cssText = `
      font-weight: 600;
      margin-bottom: 4px;
    `;
    textContainer.appendChild(title);

    // Mensagem
    const messageText = document.createElement('div');
    messageText.textContent = message;
    messageText.style.cssText = `
      font-size: 14px;
      opacity: 0.9;
    `;
    textContainer.appendChild(messageText);

    notification.appendChild(textContainer);

    // Botão de fechar
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0 4px;
      opacity: 0.8;
      transition: opacity 200ms ease;
      line-height: 1;
    `;
    closeButton.addEventListener('mouseover', () => closeButton.style.opacity = '1');
    closeButton.addEventListener('mouseleave', () => closeButton.style.opacity = '0.8');
    closeButton.addEventListener('click', () => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      setTimeout(() => notification.remove(), 400);
    });
    notification.appendChild(closeButton);

    notificationContainer.appendChild(notification);

    // Anima a entrada
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    });

    // Remove após 5 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 400);
      }
    }, 5000);
  }

  // Função para gerar mensagem personalizada
  function getPersonalizedMessage() {
    if (!selectedReasons || selectedReasons.length === 0) {
      return "Que ótimo ter você com a gente! Vamos continuar evoluindo juntos.";
    }

    if (selectedReasons.includes('sem-limite')) {
      return "Excelente! Vamos encontrar a melhor solução financeira para você.";
    }
    if (selectedReasons.includes('sem-tempo')) {
      return "Ótimo! Nosso conteúdo está disponível 24/7 para seu ritmo.";
    }
    if (selectedReasons.includes('falta-evoluo')) {
      return "Perfeito! Vamos te ajudar a alcançar todo seu potencial.";
    }
    
    return "Que bom que decidiu ficar! Continue sua jornada de evolução.";
  }

  // Adiciona interação nos botões
  manterButtons.forEach(button => {
    // Hover effect
    button.style.transition = 'transform 200ms ease, box-shadow 200ms ease';
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 4px 12px rgba(14, 65, 148, 0.15)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
      button.style.boxShadow = '';
    });

    // Click handler
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Anima o botão
      button.style.transform = 'scale(0.98)';
      setTimeout(() => button.style.transform = '', 200);
      
      // Limpa os motivos salvos mas não mostra notificação (agora é pelo botão)
      try {
        localStorage.removeItem('motivoCancelamento');
      } catch (err) {
        console.warn('Erro ao limpar motivoCancelamento:', err);
      }

      // Anima o botão de notificação para chamar atenção
      notifyButton.style.transform = 'scale(1.1)';
      setTimeout(() => {
        notifyButton.style.transform = 'scale(1)';
      }, 200);
    });

    // Keyboard support
    button.setAttribute('tabindex', '0');
    button.setAttribute('role', 'button');
    
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });
});
