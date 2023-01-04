import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import useMarvelService from '../../services/MarvelService';

import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId]);

    const updateChar = () => {
        const { charId } = props;
        
        if (!charId) {
            return;
        }

        clearError();
        getCharacter(charId)
            .then(onCharLoaded);
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const skeleton = char || loading || error ? null : <Skeleton />;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;

    let thumbnailClassList;

    thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? 
        thumbnailClassList = 'char__basics contain' : thumbnailClassList = 'char__basics';

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} className={thumbnailClassList}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} target="_blank" className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} target="_blank" className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            { comics.length === 0 ? <div className="char__comics">Comics not found...</div> : <div className="char__comics">Comics amount: {comics.length}</div> }
            <ul className="char__comics-list">
                {
                    comics.map((item, i) => {
                        while(i < 10) {
                            return (
                                <li key={i} className="char__comics-item">
                                    <Link to={`/comics/${item.resourceURI.split('/')[6]}`}>
                                        {item.name}
                                    </Link>
                                </li>
                            )
                        }
                    })
                }
            </ul>
        </>
    )
}

export default CharInfo;