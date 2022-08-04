import { useState, useEffect } from 'react';
import { db } from '../../utils/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore/lite';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Loading from '../../components/loading';
import styles from "../../styles/showmovie.module.scss"
import Carousels from '../../components/carousel';

const Movie = (props) => {
    const state = {
        name: '',
        tag: [],
        description: '',
        director: [],
        writers: [],
        stars: [],
        rating: '',
        poster: [],
        images: [],
        trailer: '',
        duration: '',
        release: Date,
        limit: '',
        active: Boolean
    }
    // const router = useRouter()
    // const { id } = router.query;
    const [movie, setMovie] = useState(state);
    const [removeMovie, setRemoveMovie] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(async () => {
        try {
            setLoading(true)
            const res = await getDoc(doc(db, 'movies', `${props.id}`))
            setMovie(res.data())
            setLoading(false)
        } catch (error) {
            setLoading(false)
            return toast.error(error.message)
        }
    }, [])

    return (
        <div className={styles.container}>
            {
                loading && <Loading />
            }
            <div className={styles.main_cont}>
                
                <div className={styles.details}>
                    <div className={styles.info}>
                        <div className={styles.title}>
                            <h1 id="name">Selected Floor: {movie.name}</h1>
                            
                        </div>
                      
                    </div>
                </div>
                <div className={styles.buttons}>
                    <Link href={`/movies/bookticket/${props.id}`}><a className={styles.book}>Book Seat</a></Link>
                </div>
            </div>
            
        </div>
    )
}

export async function getServerSideProps ({params: {id}}) {
    return { props: { id } };
}

export default Movie