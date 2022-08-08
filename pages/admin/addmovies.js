import { useState, useEffect } from 'react';
import ImageInput from '../../components/imageInput';
import { upload } from '../../components/uploadFiles';
import { addDoc, collection } from 'firebase/firestore/lite'
import { db } from '../../utils/firebaseConfig';
import { toast } from "react-toastify";
import Loading from '../../components/loading';
import styles from "../../styles/adding.module.scss";
import close from "../../public/cancel.svg";
import Image from "next/image"


import { getDoc, doc } from "firebase/firestore/lite";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Router from "next/router"

const AddMovies = () => {
    const state = {
        name: '',
        description: '',
        poster: [],
        images: [],
        limit: '',
        active: false
    }

    const [movie, setMovie] = useState(state)
    const [files, setFiles] = useState([])
    const [poster, setPoster] = useState([])
    const [err, setErr] = useState('')
    const [isUploaded, setIsUploaded] = useState(false)
    const [loading, setLoading] = useState(false)

    const auth = getAuth()

    useEffect(() => {
        try {
            onAuthStateChanged(auth, async (u) => {
                if(u){
                const us = await getDoc(doc(db, 'users', `${u.uid}`))
                const data = us.data()
                const last = Router.pathname.split("/")
                if(data.role == "user" && last[1] == "admin")
                    Router.push("/");
                }
            })
        } catch (error) {
            return toast.error(error.message)
        }
    }, [])

    const handleInputChange = e => {
        const { name, value } = e.target
        setMovie({...movie, [name]: value})
    }

    

      

    const handleUpload = async () => {
        try {
            setLoading(true)
            const res_images = await upload(`images/${auth.currentUser.uid}`, (files))
            // setMovie({...movie, images: res_images})
            const res_poster = await upload(`images/${auth.currentUser.uid}`, (poster))
            // const trailer = movie.trailer.substring(movie.trailer.lastIndexOf("/") + 1)
            setMovie({...movie, poster: res_poster, images: res_images})
            setIsUploaded(true)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            return toast.error(error.message)
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            await addDoc(collection(db, "movies"), movie)
            setIsUploaded(false)
            setLoading(false)
            toast.success("The movie has been added successfully.")
            Router.push("/admin");
        } catch (error) {
            setLoading(false)
            return toast.error(error.message)
        }
    }

    return (
        <div className={styles.contain}>
            <div className={styles.add_form}>
            {
                loading && <Loading />
            }
                <div className={styles.add_simple}>
                    <div className={styles.add_main}>
                        <label htmlFor="name" className={styles.add_label}>Name</label>
                        <input className={styles.add_input} type="text" id="name" placeholder="name" name="name" value={movie.name} onChange={handleInputChange} autoFocus/>
                    </div>
                    <div className={styles.add_main}>
                        <label htmlFor="description" className={styles.add_label}>Description</label>
                        <input className={styles.add_input} type="text" id="description" placeholder="description" name="description" value={movie.description} onChange={handleInputChange} />
                    </div>
                    
                    
                </div>
                <div className={styles.add_simple}>
                    
                    <div className={styles.add_main}>
                        <label htmlFor="limit" className={styles.add_label}>Limit</label>
                        <input className={styles.add_input} type="text" id="limit" placeholder="limit" name="limit" value={movie.limit} onChange={handleInputChange} />
                    </div>
                    
                </div>
              
                <div className={styles.add_image_input}>
                    <div className={styles.add_main}>
                        <label htmlFor="image" className={styles.add_label}>Image</label>
                        <ImageInput multiple files={files} setFiles={setFiles} />
                    </div>
                    <div className={styles.add_main}>
                        <label htmlFor="poster" className={styles.add_label}>Poster</label>
                        <ImageInput files={poster} setFiles={setPoster} />
                    </div>
                </div>
                <div className={styles.add_cont_button}>
                    {
                        isUploaded 
                        ? <button className={styles.add_button} onClick={handleSubmit}>Submit</button>
                        : <button className={styles.add_button} onClick={handleUpload}>Upload</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default AddMovies;
