<?php

namespace Acme\TestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Usuario
 */
class Usuario
{
    /**
     * @var integer
     */
    private $id;

    /**
     * @var string
     */
    private $username;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set string
     *
     * @param string $string
     * @return Usuario
     */
    public function setUsername($username)
    {
        $this->string = $string;

        return $this;
    }

    /**
     * Get string
     *
     * @return string 
     */
    public function getUsername()
    {
        return $this->username;
    }


    public function findUsername()
    {
        $em = $this->getEntityManager();
        $consulta = $em->createQuery('select nombre from AcmeTestBundle:Usuario');

    }
}
?>