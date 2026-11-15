const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selectedServices = services
    .filter((service) => {
      return (
        (service.id === 'guide' && guideChecked) ||
        (service.id === 'audio' && audioChecked) ||
        (service.id === 'catalog' && catalogChecked)
      );
    })
    .map(({ title, price }) => ({ title: title.trim(), price }));

  const total = selectedServices.reduce((sum, service) => sum + service.price, 0);

  return {
    count: selectedServices.length,
    total,
    items: selectedServices,
  };
}

const eventTitle = document.querySelector('#event-title');
const showProgram = document.querySelector('#show-program');
const program = document.querySelector('#program');
const dataError = document.querySelector('#data-error');
const serviceForm = document.querySelector('#service-form');
const guide = document.querySelector('#guide');
const audio = document.querySelector('#audio');
const catalog = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');

let data;

try {
  data = JSON.parse(sourceJson);
} catch (error) {
  dataError.textContent = 'Ошибка данных.';
  dataError.hidden = false;
}

if (data) {
  eventTitle.textContent = data.event.title;
  serviceForm.hidden = false;

  showProgram.addEventListener('click', () => {
    program.innerHTML = data.event.meeting;
    program.hidden = false;
  });

  serviceForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const report = buildReport(
      data.services,
      guide.checked,
      audio.checked,
      catalog.checked,
    );

    if (report.count === 0) {
      choiceError.textContent = 'Выберите хотя бы одну услугу.';
      choiceError.hidden = false;
      result.hidden = true;
      reportJson.hidden = true;
      return;
    }

    choiceError.hidden = true;
    const titles = report.items.map((item) => item.title).join('<br>');
    result.innerHTML = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.<br>${titles}`;
    result.hidden = false;

    const jsonString = JSON.stringify(report);
    JSON.parse(jsonString);
    reportJson.textContent = jsonString;
    reportJson.hidden = false;
  });
}
