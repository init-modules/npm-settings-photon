# @init/settings-photon

Locale settings bridge kit for the package-first photon.

## Назначение

@init/settings-photon — npm/TypeScript package; Photon integration or runtime layer; settings/locale layer. Пакет экспортирует TypeScript/React primitives для frontend-части Init/Rx и не должен смешивать backend-интеграции с клиентским runtime.

- Этот пакет находится в слое Photon. Доменная логика должна оставаться в базовых пакетах, а здесь должны быть только адаптеры, настройки страниц, runtime-провайдеры или UI-kit для конструктора.

## Установка

~~~bash
npm install @init/settings-photon
~~~

Проверьте peer dependencies в host-приложении, особенно версии React, Next.js и соседних <code>@init/*</code> пакетов.

## Экспорты

- <code>.</code>
- <code>./server</code>

Основные entry points:
- <code>index.ts</code>
- <code>server.ts</code>

## Состав пакета

- **helpers**: <code>helpers/locales.ts</code>
- **Root**: <code>index.ts</code>, <code>module.tsx</code>, <code>server.ts</code>

## Зависимости

Runtime dependencies:
- не обнаружено

Peer dependencies:
- <code>@init/photon ^0.1.0</code>
- <code>react ^19.0.0</code>
- <code>react-dom ^19.0.0</code>

## Сборка

- <code>build: tsup src/index.ts src/server.ts --format esm --dts --clean</code>
- <code>prepack: npm run build</code>

## Разработка

- держите типы публичного API рядом с основными entry points;
- не добавляйте host-specific код в базовые frontend SDK;
- Photon UI-kit и adapter packages должны оставаться над <code>@init/photon</code>, не наоборот;
- перед публикацией выполните <code>npm run build</code>, если пакет собирается в <code>dist</code>.
