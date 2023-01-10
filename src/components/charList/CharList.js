import { useState, useEffect, useRef, useMemo } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

const setContent = (process, Component, loadingMore) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
        case 'loading':
            return loadingMore ? <Component /> : <Spinner />;
        case 'confirmed':
            return <Component />;       
        case 'error':
            return <ErrorMessage />;
        default: 
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const { getAllCharacters, process, setProcess } = useMarvelService();

    useEffect(() => {
        onRequestLoad(offset, true);
    }, []);

    const onRequestLoad = (offset, initial) => {
        initial ? setLoadingMore(false) : setLoadingMore(true);

        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;

        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setLoadingMore(loadingMore => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderCharList(arrChar) {
        const items = arrChar.map((item, i) => {
            const { id, thumbnail, name } = item;

            let thumbnailClassList;

            thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? 
                thumbnailClassList = 'randomchar__img contain' : thumbnailClassList = 'randomchar__img';

            return (
                <li 
                    className="char__item" 
                    key={i} onClick={() => {
                        props.onCharSelected(id);
                        focusOnItem(i);
                    }}
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(id);
                            focusOnItem(i);
                        }
                    }}
                    >
                    <img src={thumbnail} alt={name} className={thumbnailClassList} />
                    <div className="char__name">{name}</div>
                </li>
            );
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const elements = useMemo(() => {
        return setContent(process, () => renderCharList(charList), loadingMore);
    }, [process]);

    return (
        <div className="char__list">
            {elements}
            <button 
                className="button button__main button__long"
                disabled={loadingMore}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequestLoad(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;