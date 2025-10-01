# парсер job post Linkedin

## Установка
Клонируем репозиторий
```sh
git clone https://github.com/rickert156/linkedinJobPosts.git
```
### установка расширения
В **ext/** расположено расширение для хрома/хромиума.  
<ul>
    <li>Необходимо перейти по URL chrome://extensions/ </li>
    <li>Включить Режим разработчика</li>
    <li>Загрузить распакованное расширение(как есть в репозитории)</li>
</ul>

### установка приложения flask
В директории **server/** расположен скрипт для приема job posts.  
Для работы необходимо поставить зависимости
```sh
cd linkedinJobPosts/server/ && python3 -m venv venv && ./venv/bin/pip install -r requerments.txt
```
Для сохранения результатов парсинга необходимо запустить веб-сервер
```sh
python3 app.py
```
