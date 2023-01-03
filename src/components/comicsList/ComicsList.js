import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequestLoad(offset, true);
    }, []);

    const onRequestLoad = (offset, initial) => {
        initial ? setLoadingMore(false) : setLoadingMore(true);

        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;

        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList([...comicsList, ...newComicsList]);
        setLoadingMore(false);
        setOffset(offset + 8);
        setComicsEnded(ended);
    }

    function renderComicsList(arrComics) {
        const items = arrComics.map(item => {
            const {thumbnail, title, price, id} = item;

            return (
                <li className="comics__item" key={id}>
                    <Link to={`/comics/${id}`}>
                        <img src={thumbnail} alt={title} className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </Link>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !loadingMore ? <Spinner /> : null;
    const content = renderComicsList(comicsList);

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {content}
            <button 
                className="button button__main button__long"
                disabled={loadingMore}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequestLoad(offset)}
                >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;