import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';

/*
  ! Hooks - можно использовать только в React - компонентах
    * Должны быть вызываться одинаковое количество раз в одинаковой последовательности
    * Должны быть вызваны только на верхнем уровне в функциях компонентах

  ! Hooks - нельзя: вызывать в условных операторах и циклах, class
      const [name, setName] = useState('Sergei');
      ! так делать нельзя
      if (name === 'Sergei') {
        const [age, setAge] = useAge(25)
      }

  ! componentDidCath нельзя воссоздать при помощи hooks

  ! Можно вызывать useState и useEffect много раз в одном компоненте, и они будут полностью независимы.

  # useEffect() - регистрирует функцию у которой могут быть побочные эффекты
      * Объединяет в себе два метода жизненного цикла:
        * componentDidMount и componentDidUpdate

        - Функция сработает сразу когда компонент появиться на странице
            Можно создавать timeout или отправлять запрос на сервер
              жизненный цикл: componentDidMount

        - Функция будет срабатывать каждый раз как компонент обновиться (props)
            жизненный цикл: componentDidUpdate

      * Для того чтобы обновлять компонент, только тогда когда обновились определенные свойства:
        - class:
          componentDidUpdate(prevProps) {
            if (prevProps.value !== this.props.value) {...}
          }

        - hooks:
            необходимо передать вторым аргументом массив тех данных
            которые будем проверять, для того чтобы решить следует ли
            вызывать этот хук или нет.
              useEffect(() => {...}, [value])

          ! При этом сравнивать значения как componentDidUpdate, не нужно
            этот функционал уже реализован в хуке

          ! Если вторым аргументом передать пустой массив, то функция сработает только один раз
            как componentDidMount

          ! Если не передавать вторым аргументом массив, то код внутри useEffect
            вызываться каждый раз, когда компонент обновляется, при любых изменениях состояния

      * Для того, чтобы очищать эффекты которые производим внутри функции useEffect
          Например снимать таймеры
          Аналог метода жизненого цикла componentWillUnmount
            Для запуска необходимо вернуть функцию
                useEffect(() => {
                    console.log('mount') - когда компонент создается
                    return () => console.log('unmount'); - когда компонент уничтожается
              }, []);

        ! Но в отличие от componentWillUnmount, функция будет запускать
          не только когда компонент пропадает, но и тогда когда нужно запустить
          следующий эффект, то есть очистка предыдущего и запись нового значения
            При увеличении, уменьшении счетчика будет вызываться тоже функция
               return () => console.log('unmount');

    # componentDidMount + componentWillUnmount
      useEffect(() => {
          console.log('mount') - когда компонент создается
          return () => console.log('unmount'); - когда компонент уничтожается
      }, []); - Вызовется один раз

    # componentDidUpdate (НО будет вызван при mount компонента)
      useEffect(() => {
          console.log('update');
      });

    # Стандартный метод отмены Fetch запроса - AbortController
        useEffect(() => {
          const controller = new AbortController();
          fetch(`https://swapi.co/api/planets/${id}`, {
            signal: controller.signal,
          })
          ...
          return () => controller.abort();
        }, [id])

        ! Техника собственного прерывания будет работать, не только с fetch и с другими промисами

    # Собственные Hooks, любые функции начинающиеся с use.
        Можно использующие стандартные hooks + другие собственные.
        Можно выносить переиспользуемую Логику. Аналог компонентов высшего порядка HOC()

    # useCallback - сохраняет (кеширует) функцию между вызовами, если данные в массиве зависим. не изменились
        Если используется callback, внутри которого проверяется та ли эта функции,
        то происходит постоянный перерандаринг компонента, из-за того, что при обновления компонента
        создается новая функция, и раз функция новая снова происходит перерендаринг, тем самым рекурсия
          const request = () => getPlanet(id);
          return useRequest(request);

        Для этих целей, есть hook useCallback(() => getPlanet(id), [id]) - который принимает функцию
        и массив параметров при которых должно происходить обновления

        ! То если id не изменился useCallback вернет ссылку на ту же функцию, что и была
        тем самым предотвращая перерендаринг
        ! Если id изменился, то и функция будет новая и будет перерендаринг

    # useMemo - сохраняет (кеширует) результат функции (значение) между вызовами, если данные в массиве зависим. не изменились
        Если нужно создать какое-нибудь значение, которое потом будет передаваться в
        useEffect, а он же будет использовать это значение, чтобы сравнить старое состояние с новым,
        необходимо кешировать значение: useMemo

        ! Второй аргумент пустой массив, значит значение не зависит не от каких данных и будет вычисляться один раз
  */

const App = () => {
  // Счетчик
  const [value, setValue] = useState(1); // Первоначальное состояние
  // Следует ли отображаться счетчики
  const [visible, setVisible] = useState(true);

  if (visible) {
    return (
      <div>
        <Notification />

        <button onClick={() => setValue((v) => (v <= 1 ? 1 : v - 1))}>-</button>
        <button onClick={() => setValue((v) => v + 1)}>+</button>
        <button onClick={() => setVisible(false)}>hide</button>

        <HookCounter value={value} />

        <PlanetInfo id={value} />
      </div>
    );
  } else {
    return <button onClick={() => setVisible(true)}>show</button>;
  }
};

// # Показ id
const HookCounter = ({ value }) => {
  useEffect(() => {
    console.log('mount');

    return () => console.log('unmount');
  }, []);

  useEffect(() => {
    console.log('update');
  });

  return <p>id: {value}</p>;
};

// # Пропадающее сообщение
const Notification = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 4000);
    // ! Обязательно снимать таймер
    return () => clearTimeout(timeout);
  }, []);

  return visible && <p>Hello</p>;
};

// Асинхронная функция которая получает данные
// (Отдельный компонент сервис на загрузки данных)
const getPlanet = (id) => {
  return fetch(`https://swapi.co/api/planets/${id}`)
    .then((res) => res.json())
    .then((data) => data);
};

// # Собственный Hook
// Hook который принимает асинхронную функцию (request) и получает из нее данные
// Учитывая отмену обаработки Fetch
const useRequest = (request) => {
  const initialState = useMemo(
    () => ({
      data: null, // Объект с данными
      loading: true,
      error: null,
    }),
    []
    // пустой массив, значит значение не зависит не от каких данных и будет вычисляться один раз
  );

  const [dateState, setDateState] = useState(initialState);

  useEffect(() => {
    // Когда начинаем загружать данные, сбрасываем state на первоначальное состояние
    // Чтобы не копировать тоже состояние, что и при useState необходимо создать объект
    // Через hook useMemo создать этот объект
    // setDateState({ data: null, loading: true, error: null });
    setDateState(initialState);

    // ! Собственный проигнорировать результат Fetch или Promise
    //  При сокрытии, и загрузки данных будет ошибка, если не отменять Fetch
    let cancelled = false;
    request()
      .then((data) => !cancelled && setDateState({ data, loading: false, error: null }))
      .catch(
        (error) => !cancelled && setDateState({ data: null, loading: false, error })
      );

    return () => (cancelled = true);
  }, [request, initialState]);

  return dateState;
};

// # Собственный Hook
const usePlanetInfo = (id) => {
  // ! Необходимо, сделать так чтобы функция не пересоздавалась, не происходала Рекурсия,
  // из-за useRequest -> useCallback -> useEffect -> [request]
  // Если id не изменился, ссылка на функцию останется прежней
  const request = useCallback(() => getPlanet(id), [id]);
  return useRequest(request);
};

// # Асинхронная загрузка данных
const PlanetInfo = ({ id }) => {
  const { data, loading, error } = usePlanetInfo(id);

  if (error) {
    return <div>Something is wrong</div>;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  // Проверка есть ли данные {data && data.name}
  return <div>Planet Name: {data.name}</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
