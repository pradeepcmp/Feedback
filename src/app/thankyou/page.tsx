"use client"
import { useEffect } from "react"
// import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

const ThankYou = () => {
  // Confetti effect (optional)
  useEffect(() => {
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <CheckCircle className="h-16 w-16 text-green-500" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Thank You!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-gray-600 text-lg mb-2">
                Your feedback has been submitted successfully.
              </p>
              <p className="text-gray-500">
                We appreciate your time and valuable input.
              </p>
            </motion.div>
          </CardContent>

          <CardFooter className="flex justify-center pb-6 pt-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {/* <Link href="/" passHref>
                <Button 
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
                >
                  Back to Home
                </Button>
              </Link> */}
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default ThankYou